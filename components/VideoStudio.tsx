'use client';

import { useState, useRef, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ScissorsIcon,
  SparklesIcon,
  CameraIcon,
  MicrophoneIcon,
  AdjustmentsHorizontalIcon,
  CloudArrowUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import AdvancedVideoProcessor from '@/lib/video/advanced-processor';

interface VideoProject {
  id: string;
  name: string;
  duration: number;
  file_path: string;
  status: 'uploading' | 'processing' | 'ready' | 'published';
  ai_analysis?: any;
}

export default function VideoStudio() {
  const [processor] = useState(new AdvancedVideoProcessor());
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [videoAnalytics, setVideoAnalytics] = useState<any>(null);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [captions, setCaptions] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const project: VideoProject = {
      id: Date.now().toString(),
      name: file.name,
      duration: 0, // Will be set after loading
      file_path: URL.createObjectURL(file),
      status: 'uploading'
    };

    setCurrentProject(project);
  };

  const enhanceVideo = async () => {
    if (!currentProject) return;
    
    setIsProcessing(true);
    try {
      setProcessingStep('Initializing AI enhancement...');
      
      const result = await processor.enhanceVideo(currentProject.file_path, {
        format: 'mp4',
        quality: 'auto',
        ai_enhancement: true,
        auto_captions: true,
        thumbnail_generation: true,
        content_analysis: true
      });

      setVideoAnalytics(result.analytics);
      setCurrentProject(prev => prev ? {
        ...prev,
        status: 'ready',
        ai_analysis: result.suggestions
      } : null);

    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const generateCaptions = async () => {
    if (!currentProject) return;
    
    setIsProcessing(true);
    setProcessingStep('Generating AI captions...');
    
    try {
      const result = await processor.generateCaptions(currentProject.file_path);
      setCaptions(result);
    } catch (error) {
      console.error('Caption generation failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const generateThumbnails = async () => {
    if (!currentProject) return;
    
    setIsProcessing(true);
    setProcessingStep('Creating AI-optimized thumbnails...');
    
    try {
      const result = await processor.generateThumbnails(currentProject.file_path);
      setThumbnails(result.thumbnails);
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <ScissorsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Video Studio</h1>
                <p className="text-sm text-gray-500">AI-Powered Video Creation & Enhancement</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {!currentProject ? (
          // Upload Area
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CameraIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Create Your Next Masterpiece
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload your video and let our AI assistant help you optimize it for maximum engagement and revenue.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>Upload Video</span>
            </button>
          </div>
        ) : (
          // Video Editor Interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    src={currentProject.file_path}
                    controls
                    className="w-full h-full"
                  />
                </div>
                
                {/* Video Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{currentProject.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentProject.status === 'ready' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {currentProject.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={enhanceVideo}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      <span>{isProcessing ? 'Enhancing...' : 'AI Enhance'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <div>
                      <p className="font-medium text-blue-900">Processing Video</p>
                      <p className="text-sm text-blue-700">{processingStep}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Analytics */}
              {videoAnalytics && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-purple-600" />
                    AI Video Analysis
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {videoAnalytics.audience_retention}%
                      </p>
                      <p className="text-sm text-gray-600">Retention Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {videoAnalytics.completion_rate}%
                      </p>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.floor(videoAnalytics.avg_watch_time)}s
                      </p>
                      <p className="text-sm text-gray-600">Avg Watch Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {videoAnalytics.drop_off_points.length}
                      </p>
                      <p className="text-sm text-gray-600">Drop-off Points</p>
                    </div>
                  </div>

                  {/* Engagement Heatmap */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Engagement Heatmap</p>
                    <div className="h-16 bg-gray-100 rounded flex items-end space-x-0.5 overflow-hidden">
                      {videoAnalytics.engagement_heatmap.slice(0, 50).map((value: number, index: number) => (
                        <div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-purple-600 to-pink-400 opacity-70"
                          style={{ height: `${(value / 100) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Side Panel - AI Tools */}
            <div className="space-y-6">
              {/* AI Enhancement Tools */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-purple-600" />
                  AI Tools
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={generateCaptions}
                    disabled={isProcessing}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <MicrophoneIcon className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Generate Captions</p>
                      <p className="text-sm text-gray-600">AI-powered transcription</p>
                    </div>
                  </button>

                  <button
                    onClick={generateThumbnails}
                    disabled={isProcessing}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <CameraIcon className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Smart Thumbnails</p>
                      <p className="text-sm text-gray-600">AI-optimized previews</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Auto Enhance</p>
                      <p className="text-sm text-gray-600">Color & audio optimization</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* AI Suggestions */}
              {currentProject?.ai_analysis && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-purple-900 mb-4">AI Suggestions</h3>
                  
                  <div className="space-y-3">
                    {currentProject.ai_analysis.content_improvements.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <SparklesIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Thumbnails */}
              {thumbnails.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">AI Thumbnails</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {thumbnails.map((thumb, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                            Thumb {index + 1}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium text-center">
                              AI Score: {thumb.ai_score.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption Status */}
              {captions && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Captions Generated!</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Accuracy: {captions.accuracy_score}%
                  </p>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-green-600 text-white px-3 py-1 rounded">
                      Download SRT
                    </button>
                    <button className="text-xs bg-green-600 text-white px-3 py-1 rounded">
                      Download VTT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}