import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

type AudioPlayerProps = {
  title: string;
  description: string;
  videoUrl: string;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  description,
  videoUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerReady = useRef(false);

  // Function to send commands to the YouTube iframe
  const postMessageToPlayer = useCallback((action: string, value?: any) => {
    if (videoRef.current && videoRef.current.contentWindow) {
      try {
        videoRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: action,
            args: value ? [value] : [],
          }),
          '*'
        );
      } catch (error) {
        console.warn('Error sending message to player:', error);
      }
    }
  }, []);

  // Handles the play/pause event
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      postMessageToPlayer('pauseVideo');
    } else {
      setTimeout(() => {
        postMessageToPlayer('playVideo');
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, postMessageToPlayer]);

  // Handles mute/unmute
  const handleMuteToggle = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    postMessageToPlayer(newMutedState ? 'mute' : 'unMute');
  }, [isMuted, postMessageToPlayer]);

  // Extract YouTube video ID
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeEmbedId = extractVideoId(videoUrl);

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">🎧 Audio Practice</h3>
            <p className="text-green-100 text-xs">{description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePlayPause}
          className="w-14 h-14 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="text-gray-800" size={20} />
          ) : (
            <Play className="text-gray-800 ml-1" size={20} />
          )}
        </button>

        <button
          onClick={handleMuteToggle}
          className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
        >
          {isMuted ? (
            <VolumeX className="text-white" size={16} />
          ) : (
            <Volume2 className="text-white" size={16} />
          )}
        </button>
      </div>

      {youtubeEmbedId ? (
        <iframe
          width="320"
          height="240"
          src={`${videoUrl}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&playlist=${youtubeEmbedId}&loop=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          title={`${title} Audio`}
          ref={videoRef}
          style={{
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            opacity: 0,
            pointerEvents: 'none',
            width: '320px',
            height: '240px'
          }}
        />
      ) : (
        <p className="text-red-300 mt-2 text-center text-xs">Error: Audio not available</p>
      )}

      <div className="mt-3 text-center">
        <p className="text-green-100 text-xs">
          💡 Listen carefully and answer the questions below
        </p>
      </div>
    </div>
  );
};

export default AudioPlayer; 