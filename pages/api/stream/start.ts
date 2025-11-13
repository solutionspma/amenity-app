import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Server } from 'socket.io';
import NodeMediaServer from 'node-media-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface StreamRequest {
  streamKey: string;
  userId: string;
  title?: string;
}

let mediaServer: any = null;
let io: Server | null = null;

// Initialize Node Media Server for RTMP streaming
function initializeMediaServer() {
  if (mediaServer) return mediaServer;

  const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      allow_origin: '*',
      mediaroot: './media',
    },
    relay: {
      ffmpeg: '/usr/local/bin/ffmpeg', // Adjust path as needed
      tasks: [
        {
          app: 'live',
          mode: 'push',
          edge: 'rtmp://localhost/hls',
        },
      ],
    },
  };

  mediaServer = new NodeMediaServer(config);

  // Handle stream events
  mediaServer.on('preConnect', (id: string, args: any) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });

  mediaServer.on('postConnect', (id: string, args: any) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });

  mediaServer.on('doneConnect', (id: string, args: any) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });

  mediaServer.on('prePublish', async (id: string, StreamPath: string, args: any) => {
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    
    // Extract stream key from path
    const streamKey = StreamPath.split('/').pop();
    
    // Verify stream key exists in database
    const { data: stream } = await supabase
      .from('live_streams')
      .select('*')
      .eq('stream_key', streamKey)
      .single();

    if (!stream) {
      console.log('Invalid stream key:', streamKey);
      return false; // Reject unauthorized stream
    }

    // Update stream status to live
    await supabase
      .from('live_streams')
      .update({
        is_live: true,
        started_at: new Date().toISOString(),
        rtmp_url: `rtmp://localhost:1935/live/${streamKey}`,
        hls_url: `http://localhost:8000/live/${streamKey}/index.m3u8`,
      })
      .eq('stream_key', streamKey);

    // Notify viewers via Socket.IO
    if (io) {
      io.emit('stream_started', {
        streamId: stream.id,
        streamKey,
        title: stream.title,
        userId: stream.user_id,
      });
    }

    // Create notification for followers
    const { data: followers } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', stream.user_id);

    if (followers) {
      const notifications = followers.map(follow => ({
        user_id: follow.follower_id,
        type: 'live',
        title: 'Live Stream Started',
        message: `${stream.title} is now live!`,
        data: { stream_id: stream.id, stream_key: streamKey },
      }));

      await supabase
        .from('notifications')
        .insert(notifications);
    }
  });

  mediaServer.on('postPublish', (id: string, StreamPath: string, args: any) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });

  mediaServer.on('donePublish', async (id: string, StreamPath: string, args: any) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    
    const streamKey = StreamPath.split('/').pop();
    
    // Update stream status
    const { data: stream } = await supabase
      .from('live_streams')
      .update({
        is_live: false,
        ended_at: new Date().toISOString(),
      })
      .eq('stream_key', streamKey)
      .select()
      .single();

    if (stream) {
      // Calculate duration
      const startTime = new Date(stream.started_at).getTime();
      const endTime = new Date().getTime();
      const duration = Math.floor((endTime - startTime) / 1000);

      await supabase
        .from('live_streams')
        .update({ duration })
        .eq('id', stream.id);

      // Notify via Socket.IO
      if (io) {
        io.emit('stream_ended', {
          streamId: stream.id,
          streamKey,
          duration,
        });
      }
    }
  });

  return mediaServer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { streamKey, userId, title }: StreamRequest = req.body;

    try {
      // Initialize media server if not already running
      if (!mediaServer) {
        mediaServer = initializeMediaServer();
        mediaServer.run();
      }

      // Create or update stream record
      const { data: stream, error } = await supabase
        .from('live_streams')
        .upsert({
          stream_key: streamKey,
          user_id: userId,
          title: title || 'Live Stream',
          is_live: false,
          viewer_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        streamId: stream.id,
        rtmpUrl: `rtmp://localhost:1935/live/${streamKey}`,
        streamKey,
        message: 'Stream server initialized',
      });

    } catch (error) {
      console.error('Stream start error:', error);
      res.status(500).json({ error: 'Failed to start stream' });
    }

  } else if (req.method === 'DELETE') {
    const { streamKey } = req.body;

    try {
      // Update stream to not live
      await supabase
        .from('live_streams')
        .update({
          is_live: false,
          ended_at: new Date().toISOString(),
        })
        .eq('stream_key', streamKey);

      res.status(200).json({ success: true, message: 'Stream ended' });

    } catch (error) {
      console.error('Stream end error:', error);
      res.status(500).json({ error: 'Failed to end stream' });
    }

  } else if (req.method === 'GET') {
    // Get stream status
    const { streamKey } = req.query;

    try {
      const { data: stream } = await supabase
        .from('live_streams')
        .select(`
          *,
          user:amenity_profiles(username, display_name, avatar_url)
        `)
        .eq('stream_key', streamKey)
        .single();

      if (!stream) {
        return res.status(404).json({ error: 'Stream not found' });
      }

      res.status(200).json(stream);

    } catch (error) {
      console.error('Stream status error:', error);
      res.status(500).json({ error: 'Failed to get stream status' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Socket.IO setup for real-time stream events
export function initializeSocketIO(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join stream room for real-time updates
      socket.on('join_stream', (streamKey: string) => {
        socket.join(`stream_${streamKey}`);
        console.log(`Client ${socket.id} joined stream ${streamKey}`);

        // Update viewer count
        updateViewerCount(streamKey, 1);
      });

      // Leave stream room
      socket.on('leave_stream', (streamKey: string) => {
        socket.leave(`stream_${streamKey}`);
        console.log(`Client ${socket.id} left stream ${streamKey}`);

        // Update viewer count
        updateViewerCount(streamKey, -1);
      });

      // Handle stream chat
      socket.on('stream_message', async (data: any) => {
        const { streamKey, message, userId } = data;

        // Get user info
        const { data: user } = await supabase
          .from('amenity_profiles')
          .select('username, display_name, avatar_url')
          .eq('id', userId)
          .single();

        if (user) {
          const chatMessage = {
            id: Date.now(),
            user,
            message,
            timestamp: new Date().toISOString(),
          };

          // Broadcast to all viewers in stream room
          io?.to(`stream_${streamKey}`).emit('new_message', chatMessage);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  
  return io;
}

async function updateViewerCount(streamKey: string, delta: number) {
  try {
    await supabase.rpc('increment_viewer_count', {
      stream_key_param: streamKey,
      delta_param: delta,
    });
  } catch (error) {
    console.error('Error updating viewer count:', error);
  }
}