import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Minus,
  Ruler,
  Square,
  Eraser,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import VideoAnnotationCanvas, { type Annotation } from '../components/VideoAnnotationCanvas';
import { fetchAnnotations, saveAnnotations } from '../services/annotations.service';
import { supabase } from '../../../lib/supabase';

export default function VideoDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Annotation state
  const [currentTool, setCurrentTool] = useState<'line' | 'angle' | 'rect' | 'eraser' | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load video data and annotations
  useEffect(() => {
    async function loadVideo() {
      if (!id) return;

      try {
        // Fetch video metadata from Supabase
        if (supabase) {
          const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .select('*')
            .eq('id', id)
            .single();

          if (videoError) {
            console.error('Error loading video:', videoError);
          } else if (videoData) {
            setVideoUrl(videoData.url);
          }
        }

        // Load annotations
        if (id) {
          const loadedAnnotations = await fetchAnnotations(id);
          setAnnotations(loadedAnnotations);
        }
      } catch (error) {
        console.error('Error loading video and annotations:', error);
      } finally {
        setLoading(false);
      }
    }
    loadVideo();
  }, [id]);

  // Debounced auto-save for annotations
  const handleAnnotationsChange = useCallback((newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set saving status
    setSaveStatus('saving');

    // Debounce save by 2 seconds
    saveTimerRef.current = setTimeout(async () => {
      if (!id) return;

      try {
        await saveAnnotations(id, newAnnotations);
        setSaveStatus('saved');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Error saving annotations:', error);
        setSaveStatus('error');
      }
    }, 2000);
  }, [id]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // Video control functions
  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }

  function skipBackward() {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
  }

  function skipForward() {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
  }

  function frameBackward() {
    if (!videoRef.current) return;
    // Assuming 30fps, one frame = 1/30 second
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1/30);
  }

  function frameForward() {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 1/30);
  }

  function handleTimeUpdate() {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }

  function handleLoadedMetadata() {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/videos')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
            Video Analysis
          </h1>
        </div>

        {/* Save Status Indicator */}
        {saveStatus !== 'idle' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            {saveStatus === 'saving' && (
              <>
                <Save className="h-4 w-4 text-gray-600 dark:text-gray-400 animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-600 dark:text-green-400">Saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">Save failed</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Video Player with Annotation Overlay */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-6">
        <video
          ref={videoRef}
          src={videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Annotation Canvas Overlay */}
        <VideoAnnotationCanvas
          videoRef={videoRef}
          currentTime={currentTime}
          currentTool={currentTool}
          onAnnotationsChange={handleAnnotationsChange}
          initialAnnotations={annotations}
          shouldReset={resetTrigger > 0}
        />
      </div>

      {/* Playback Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full mb-4"
        />

        {/* Time Display */}
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center gap-4">
          {/* Frame Backward */}
          <button
            onClick={frameBackward}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Previous frame"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Skip Backward */}
          <button
            onClick={skipBackward}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Skip backward 5s"
          >
            <SkipBack className="h-6 w-6" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            {playing ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-0.5" />
            )}
          </button>

          {/* Skip Forward */}
          <button
            onClick={skipForward}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Skip forward 5s"
          >
            <SkipForward className="h-6 w-6" />
          </button>

          {/* Frame Forward */}
          <button
            onClick={frameForward}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Next frame"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Annotation Tools */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Annotation Tools</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentTool(currentTool === 'line' ? null : 'line')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentTool === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Minus className="h-4 w-4" />
            <span>Line</span>
          </button>

          <button
            onClick={() => setCurrentTool(currentTool === 'angle' ? null : 'angle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentTool === 'angle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Ruler className="h-4 w-4" />
            <span>Angle</span>
          </button>

          <button
            onClick={() => setCurrentTool(currentTool === 'rect' ? null : 'rect')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentTool === 'rect'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Square className="h-4 w-4" />
            <span>Rectangle</span>
          </button>

          <button
            onClick={() => setCurrentTool(currentTool === 'eraser' ? null : 'eraser')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentTool === 'eraser'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Eraser className="h-4 w-4" />
            <span>Eraser</span>
          </button>

          <button
            onClick={() => {
              setResetTrigger(prev => prev + 1);
              setCurrentTool(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>

          <div className="flex-1"></div>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </main>
  );
}
