import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

type VideoLessonProps = {
  title: string;
  description: string;
  videoUrl: string; // Expects the full YouTube embed URL (e.g., https://www.youtube.com/TULINK`:9)
  isAudioOnly?: boolean;
  onComplete: () => void;
};

const VideoLesson: React.FC<VideoLessonProps> = ({
  title,
  description,
  videoUrl,
  isAudioOnly = false,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null); // Reference to the video iframe
  const playerReady = useRef(false); // To know if the YouTube player is ready

  // Function to send commands to the YouTube iframe
  // `useCallback` is used to prevent the function from being recreated unnecessarily
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
        // Error handling for player communication
      }
    } else {
      // YouTube player is not ready or iframe not found
    }
  }, []);

  // Handles the play/pause event
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      postMessageToPlayer('pauseVideo');
    } else {
      // Give the iframe time to load before trying to play
      setTimeout(() => {
        postMessageToPlayer('playVideo');
      }, 1000);
      // Mark as watched when playback starts (even if it's just from a UI click)
      if (!hasWatched) {
        setHasWatched(true);
      }
    }
    setIsPlaying(!isPlaying); 
  }, [isPlaying, hasWatched, postMessageToPlayer]);

  // Handles the mute/unmute event
  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      postMessageToPlayer('unMute');
    } else {
      postMessageToPlayer('mute');
    }
    setIsMuted(!isMuted); // Updates the local state
  }, [isMuted, postMessageToPlayer]);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    setHasWatched(true);
  }, []);

  // Listens for messages from the YouTube iframe (IFrame Player API)
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Verifies the origin for security: must be from YouTube
      if (!event.origin.includes('youtube.com') && !event.origin.includes('youtu.be')) {
        return;
      }

      let data;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return; // Not a valid JSON
      }

      // Detects that the player is ready
      if (data && data.event === 'onReady') {
        playerReady.current = true;
        // If it's an audio lesson, make sure the audio starts playing after it's ready
        // and that it's not muted if the local state indicates it shouldn't be.
        if (isAudioOnly) {
          setTimeout(() => {
            postMessageToPlayer('unMute');
            postMessageToPlayer('playVideo');
          }, 500);
        }
      }

      // Detects player state changes
      if (data && data.event === 'onStateChange') {
        const playerState = data.info; // 0=ended, 1=playing, 2=paused, 3=buffering, 5=video cued

        if (playerState === 0) { // Video ended
          handleVideoEnd();
        } else if (playerState === 1) { // Playing
          setIsPlaying(true);
          setHasWatched(true); // Marked as watched once it starts playing
        } else if (playerState === 2) { // Paused
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [handleVideoEnd, isAudioOnly, postMessageToPlayer]); // Dependencies for the effect


  // Builds the embed URL for the iframe
  // `controls=1` shows the native YouTube controls.
  const embedBaseSrc = `${videoUrl}?enablejsapi=1&autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`;
  const embedSrcWithMute = `${embedBaseSrc}&mute=${isMuted ? 1 : 0}`;

  // Extracts the video ID from the embed URL for audio mode (for `playlist` and `loop`)
  const extractVideoId = (url: string) => {
    // Searches for the /embed/VIDEO_ID pattern in the URL
    const embedMatch = url.match(/\/embed\/([^?]+)/);
    if (embedMatch) {
      return embedMatch[1];
    }
    return null;
  };
  
  const youtubeEmbedId = extractVideoId(videoUrl);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        {/* Main Video/Audio Player Container */}
        <div className={`relative ${isAudioOnly ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gray-900'} aspect-video flex items-center justify-center`}>
          {isAudioOnly ? (
            // --- Audio Only Mode ---
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Volume2 size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio Lesson</h3>
              <p className="text-purple-100 mb-4">Listen carefully to practice pronunciation</p>
              
              {/* Play/Pause button visible for audio mode */}
              <button
                onClick={handlePlayPause} // Uses the handler that sends the message to the iframe
                className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-105 mx-auto mb-4"
              >
                {isPlaying ? (
                  <Pause className="text-gray-800" size={24} />
                ) : (
                  <Play className="text-gray-800 ml-1" size={24} />
                )}
              </button>

              {youtubeEmbedId ? (
                  // Hidden YouTube iframe to play only the audio
                  <iframe
                    width="320"
                    height="240"
                    // Specific parameters for audio: controls=0, showinfo=0, playlist+loop for repetition
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
                  ></iframe>
                ) : (
                  <p className="text-red-300 mt-2">Error: Video ID not found for audio.</p>
                )}
            </div>
          ) : (
            // --- Video Mode ---
            videoUrl ? ( // Renders the iframe if the embed URL exists
              <iframe
                ref={videoRef}
                width="100%"
                height="100%"
                src={embedSrcWithMute} // Uses the base URL with the mute parameter
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={title}
                className="absolute inset-0 w-full h-full"
              ></iframe>
            ) : (
              // Placeholder if no video URL is defined
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Play size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Video Lesson</h3>
                <p className="text-gray-300">Watch and learn from real examples</p>
                <p className="text-red-300 mt-2">Error: Video URL not defined or invalid.</p>
              </div>
            )
          )}

          {/* Play/Pause overlay for Video mode (if you want to control it from your UI).
              Shown only if it's not audio, not playing, and there is a valid URL.
              Serves as a visible "start button" for the user if autoplay is blocked. */}
          {!isAudioOnly && !isPlaying && videoUrl && (
             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
               <button
                 onClick={handlePlayPause}
                 className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-105"
               >
                 <Play className="text-gray-800 ml-1" size={32} />
               </button>
             </div>
           )}

          {/* Mute/Unmute controls for both modes (video/audio).
              These buttons now attempt to control the YouTube iframe. */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleMuteToggle}
              className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Simulated progress indicator: Animation based on the local `isPlaying` state. */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
              <div className="h-full bg-purple-500 animate-pulse" style={{ width: '30%' }}></div>
            </div>
          )}
        </div>

        {/* Lesson Information and Tips */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-lg">
                {isAudioOnly ? 'Audio Practice' : 'Video Lesson'}
              </h4>
              <p className="text-sm text-gray-500">
                {isAudioOnly ? 'Focus on listening and pronunciation' : 'Watch carefully and take notes'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasWatched && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Watched
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="font-medium mb-2">Learning Tips:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {isAudioOnly ? (
                <>
                  <li>• Listen carefully to the pronunciation</li>
                  <li>• Repeat the words and phrases you hear</li>
                  <li>• Pay attention to the accent and intonation</li>
                  <li>• Practice speaking along with the audio</li>
                </>
              ) : (
                <>
                  <li>• Watch the video at least once completely</li>
                  <li>• Pay attention to body language and context</li>
                  <li>• Take notes of new vocabulary</li>
                  <li>• Practice the expressions you learn</li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={onComplete}
            disabled={!hasWatched}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              hasWatched
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {hasWatched ? 'Continue to Questions' : `${isAudioOnly ? 'Listen to' : 'Watch'} the ${isAudioOnly ? 'audio' : 'video'} first`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;