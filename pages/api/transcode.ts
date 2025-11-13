import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TranscodeRequest {
  videoUrl: string;
  userId: string;
  postId?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoUrl, userId, postId }: TranscodeRequest = req.body;

    console.log('Starting transcoding for:', videoUrl);

    // Create unique job ID
    const jobId = `${userId}-${Date.now()}`;
    const tempDir = `/tmp/transcode-${jobId}`;
    const inputFile = path.join(tempDir, 'input.mp4');
    
    // Create temp directory
    await execAsync(`mkdir -p ${tempDir}`);

    // Download video from Supabase storage
    const response = await fetch(videoUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(inputFile, Buffer.from(buffer));

    // Get video metadata
    const metadata = await getVideoMetadata(inputFile);
    const isShort = metadata.height > metadata.width; // Portrait = Short

    // Generate different quality variants
    const variants = [
      { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
      { name: '720p', width: 1280, height: 720, bitrate: '2500k' },
      { name: '480p', width: 854, height: 480, bitrate: '1000k' },
      { name: '360p', width: 640, height: 360, bitrate: '500k' },
    ];

    // For shorts, adjust dimensions
    if (isShort) {
      variants.forEach(variant => {
        const aspectRatio = 9 / 16; // TikTok/Instagram ratio
        variant.width = Math.floor(variant.height * aspectRatio);
      });
    }

    // Generate HLS playlist
    const hlsDir = path.join(tempDir, 'hls');
    await execAsync(`mkdir -p ${hlsDir}`);

    const transcodePromises = variants.map(async (variant) => {
      const outputDir = path.join(hlsDir, variant.name);
      await execAsync(`mkdir -p ${outputDir}`);

      return new Promise<void>((resolve, reject) => {
        ffmpeg(inputFile)
          .videoCodec('libx264')
          .audioCodec('aac')
          .videoBitrate(variant.bitrate)
          .size(`${variant.width}x${variant.height}`)
          .outputOptions([
            '-preset veryfast',
            '-hls_time 10',
            '-hls_list_size 0',
            '-hls_segment_filename', `${outputDir}/segment_%03d.ts`,
            '-f hls'
          ])
          .output(path.join(outputDir, 'playlist.m3u8'))
          .on('end', () => {
            console.log(`Transcoding completed for ${variant.name}`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`Transcoding error for ${variant.name}:`, err);
            reject(err);
          })
          .run();
      });
    });

    // Generate thumbnail
    const thumbnailPath = path.join(tempDir, 'thumbnail.jpg');
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputFile)
        .seekInput(1) // Seek to 1 second
        .frames(1)
        .size('1280x720')
        .output(thumbnailPath)
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });

    // Wait for all transcoding to complete
    await Promise.all(transcodePromises);

    // Create master playlist
    const masterPlaylist = createMasterPlaylist(variants);
    fs.writeFileSync(path.join(hlsDir, 'master.m3u8'), masterPlaylist);

    // Upload all files to Supabase storage
    const uploadPromises: Promise<string>[] = [];

    // Upload thumbnail
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);
    const thumbnailUpload = supabase.storage
      .from('media')
      .upload(`thumbnails/${jobId}.jpg`, thumbnailBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    uploadPromises.push(
      thumbnailUpload.then(({ data }) => 
        supabase.storage.from('media').getPublicUrl(data!.path).data.publicUrl
      )
    );

    // Upload master playlist
    const masterBuffer = fs.readFileSync(path.join(hlsDir, 'master.m3u8'));
    const masterUpload = supabase.storage
      .from('media')
      .upload(`hls/${jobId}/master.m3u8`, masterBuffer, {
        contentType: 'application/vnd.apple.mpegurl',
        upsert: true,
      });
    uploadPromises.push(
      masterUpload.then(({ data }) => 
        supabase.storage.from('media').getPublicUrl(data!.path).data.publicUrl
      )
    );

    // Upload all variant playlists and segments
    for (const variant of variants) {
      const variantDir = path.join(hlsDir, variant.name);
      const playlistPath = path.join(variantDir, 'playlist.m3u8');
      
      // Upload playlist
      const playlistBuffer = fs.readFileSync(playlistPath);
      const playlistUpload = supabase.storage
        .from('media')
        .upload(`hls/${jobId}/${variant.name}/playlist.m3u8`, playlistBuffer, {
          contentType: 'application/vnd.apple.mpegurl',
          upsert: true,
        });
      uploadPromises.push(
        playlistUpload.then(() => 'playlist uploaded')
      );

      // Upload segments
      const segmentFiles = fs.readdirSync(variantDir).filter(f => f.endsWith('.ts'));
      for (const segment of segmentFiles) {
        const segmentPath = path.join(variantDir, segment);
        const segmentBuffer = fs.readFileSync(segmentPath);
        const segmentUpload = supabase.storage
          .from('media')
          .upload(`hls/${jobId}/${variant.name}/${segment}`, segmentBuffer, {
            contentType: 'video/mp2t',
            upsert: true,
          });
        uploadPromises.push(
          segmentUpload.then(() => 'segment uploaded')
        );
      }
    }

    const uploadResults = await Promise.all(uploadPromises);
    const thumbnailUrl = uploadResults[0];
    const hlsUrl = uploadResults[1];

    // Generate MP4 fallback
    const mp4Path = path.join(tempDir, 'fallback.mp4');
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputFile)
        .videoCodec('libx264')
        .audioCodec('aac')
        .videoBitrate('2500k')
        .size('1280x720')
        .outputOptions(['-preset veryfast', '-movflags +faststart'])
        .output(mp4Path)
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });

    // Upload MP4 fallback
    const mp4Buffer = fs.readFileSync(mp4Path);
    const { data: mp4Data } = await supabase.storage
      .from('media')
      .upload(`videos/${jobId}.mp4`, mp4Buffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    const mp4Url = supabase.storage
      .from('media')
      .getPublicUrl(mp4Data!.path).data.publicUrl;

    // Update post in database
    if (postId) {
      await supabase
        .from('posts')
        .update({
          hls_url: hlsUrl,
          video_url: mp4Url,
          thumbnail_url: thumbnailUrl,
          is_short: isShort,
        })
        .eq('id', postId);

      // Create shorts entry if it's a short video
      if (isShort) {
        await supabase
          .from('shorts')
          .insert({
            post_id: postId,
            duration: metadata.duration,
            aspect_ratio: metadata.height / metadata.width,
          });
      }
    }

    // Clean up temp files
    await execAsync(`rm -rf ${tempDir}`);

    // Record transcoding job in database
    await supabase
      .from('transcode_jobs')
      .insert({
        job_id: jobId,
        user_id: userId,
        post_id: postId,
        original_url: videoUrl,
        hls_url: hlsUrl,
        mp4_url: mp4Url,
        thumbnail_url: thumbnailUrl,
        status: 'completed',
        metadata: metadata,
      });

    console.log('Transcoding completed successfully');

    res.status(200).json({
      success: true,
      jobId,
      hlsUrl,
      mp4Url,
      thumbnailUrl,
      isShort,
      metadata,
    });

  } catch (error) {
    console.error('Transcoding error:', error);
    res.status(500).json({ 
      error: 'Transcoding failed', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}

async function getVideoMetadata(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        resolve({
          duration: metadata.format.duration,
          width: videoStream?.width || 0,
          height: videoStream?.height || 0,
          bitrate: metadata.format.bit_rate,
          codec: videoStream?.codec_name,
        });
      }
    });
  });
}

function createMasterPlaylist(variants: any[]): string {
  let playlist = '#EXTM3U\n';
  
  variants.forEach(variant => {
    const bandwidth = parseInt(variant.bitrate) * 1000; // Convert to bps
    playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${variant.width}x${variant.height}\n`;
    playlist += `${variant.name}/playlist.m3u8\n`;
  });
  
  return playlist;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Allow large video uploads
    },
    responseLimit: false,
  },
};