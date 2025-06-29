import React, { useState, useRef, useEffect, useCallback } from 'react'; // Agregamos useCallback
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

type VideoLessonProps = {
  title: string;
  description: string;
  videoUrl: string; // Se espera la URL de incrustación completa de YouTube (ej. https://www.youtube.com/TULINK`:9)
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
  const videoRef = useRef<HTMLIFrameElement>(null); // Referencia al iframe del video
  const playerReady = useRef(false); // Para saber si el reproductor de YouTube está listo

  // Función para enviar comandos al iframe de YouTube
  // Se usa `useCallback` para evitar que la función se recree innecesariamente
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
        console.log(`Comando enviado al reproductor: ${action}`);
      } catch (error) {
        console.warn('Error al enviar mensaje al reproductor:', error);
      }
    } else {
      console.warn('Reproductor de YouTube no está listo o iframe no encontrado para enviar mensaje:', action);
    }
  }, []);

  // Maneja el evento de play/pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      postMessageToPlayer('pauseVideo');
    } else {
      // Dar tiempo al iframe para cargar antes de intentar reproducir
      setTimeout(() => {
        postMessageToPlayer('playVideo');
      }, 1000);
      // Marcar como visto al iniciar la reproducción (incluso si es solo por clic en la UI)
      if (!hasWatched) {
        setHasWatched(true);
      }
    }
    // Actualizamos el estado local inmediatamente para retroalimentación visual,
    // pero el estado real se sincronizará con los mensajes del iframe.
    setIsPlaying(!isPlaying); 
  }, [isPlaying, hasWatched, postMessageToPlayer]);

  // Maneja el evento de silenciar/desactivar silencio
  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      postMessageToPlayer('unMute');
    } else {
      postMessageToPlayer('mute');
    }
    setIsMuted(!isMuted); // Actualiza el estado local
  }, [isMuted, postMessageToPlayer]);

  // Esta función se llama cuando el video realmente termina según la API de YouTube
  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    setHasWatched(true);
    console.log('Video terminado según la API de YouTube.');
  }, []);

  // Escucha los mensajes del iframe de YouTube (API de IFrame Player)
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Verifica el origen para seguridad: debe ser de YouTube
      if (!event.origin.includes('youtube.com') && !event.origin.includes('youtu.be')) {
        return;
      }

      let data;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return; // No es un JSON válido
      }

      // Detecta que el reproductor está listo
      if (data && data.event === 'onReady') {
        playerReady.current = true;
        console.log('Reproductor de YouTube listo!');
        // Si es una lección de audio, asegúrate de que el audio comience a reproducirse después de estar listo
        // y de que no esté silenciado si el estado local indica que no debería estarlo.
        if (isAudioOnly) {
          setTimeout(() => {
            postMessageToPlayer('unMute'); // Asegura que no esté silenciado si es solo audio
            postMessageToPlayer('playVideo'); // Intenta iniciar reproducción
          }, 500);
        }
      }

      // Detecta cambios de estado del reproductor
      if (data && data.event === 'onStateChange') {
        const playerState = data.info; // 0=ended, 1=playing, 2=paused, 3=buffering, 5=video cued

        if (playerState === 0) { // Video terminado
          handleVideoEnd();
        } else if (playerState === 1) { // Reproduciendo
          setIsPlaying(true);
          setHasWatched(true); // Se marca como visto una vez que empieza a reproducirse
        } else if (playerState === 2) { // Pausado
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [handleVideoEnd, isAudioOnly, postMessageToPlayer]); // Dependencias para el efecto


  // Construye la URL de incrustación para el iframe
  // Se añade `enablejsapi=1` para la comunicación con JavaScript
  // `autoplay=1` intenta iniciar automáticamente (puede ser bloqueado por navegadores)
  // `mute=${isMuted ? 1 : 0}` intenta silenciar/desilenciar según el estado local (puede que necesite postMessage)
  // `controls=1` muestra los controles nativos de YouTube.
  const embedBaseSrc = `${videoUrl}?enablejsapi=1&autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`;
  const embedSrcWithMute = `${embedBaseSrc}&mute=${isMuted ? 1 : 0}`;

  // Extrae el ID del video de la URL de incrustación para el modo audio (para `playlist` y `loop`)
  const extractVideoId = (url: string) => {
    // Busca el patrón /embed/VIDEO_ID en la URL
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
        {/* Contenedor principal del Reproductor de Video/Audio */}
        <div className={`relative ${isAudioOnly ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gray-900'} aspect-video flex items-center justify-center`}>
          {isAudioOnly ? (
            // --- Modo Solo Audio ---
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Volume2 size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lección de Audio</h3>
              <p className="text-purple-100 mb-4">Escucha atentamente para practicar la pronunciación</p>
              
              {/* Botón de Play/Pause visible para el modo audio */}
              <button
                onClick={handlePlayPause} // Usa el manejador que envía el mensaje al iframe
                className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-105 mx-auto mb-4"
              >
                {isPlaying ? (
                  <Pause className="text-gray-800" size={24} />
                ) : (
                  <Play className="text-gray-800 ml-1" size={24} />
                )}
              </button>

              {youtubeEmbedId ? (
                 // Iframe de YouTube oculto para reproducir solo el audio
                 <iframe
                   width="320"
                   height="240"
                   // Parámetros específicos para audio: controls=0, showinfo=0, playlist+loop para repetición
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
                <p className="text-red-300 mt-2">Error: ID de video no encontrado para el audio.</p>
               )}
            </div>
          ) : (
            // --- Modo Video ---
            videoUrl ? ( // Renderiza el iframe si la URL de incrustación existe
              <iframe
                ref={videoRef}
                width="100%"
                height="100%"
                src={embedSrcWithMute} // Usa la URL base con el parámetro de mute
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={title}
                className="absolute inset-0 w-full h-full"
              ></iframe>
            ) : (
              // Placeholder si no hay una URL de video definida
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Play size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lección de Video</h3>
                <p className="text-gray-300">Mira y aprende de ejemplos reales</p>
                <p className="text-red-300 mt-2">Error: URL de video no definida o inválida.</p>
              </div>
            )
          )}

          {/* Overlay de Play/Pause para el modo Video (si quieres controlarlo desde tu UI).
              Se muestra solo si no es audio, no está reproduciendo y hay una URL válida.
              Sirve como un "botón de inicio" visible para el usuario si el autoplay es bloqueado. */}
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

          {/* Controles de Mute/Unmute para ambos modos (video/audio).
              Estos botones ahora intentan controlar el iframe de YouTube. */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleMuteToggle}
              className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Indicador de progreso simulado: Animación basada en el estado `isPlaying` local. */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
              <div className="h-full bg-purple-500 animate-pulse" style={{ width: '30%' }}></div>
            </div>
          )}
        </div>

        {/* Información y Consejos de la Lección (sin cambios) */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-lg">
                {isAudioOnly ? 'Práctica de Audio' : 'Lección en Video'}
              </h4>
              <p className="text-sm text-gray-500">
                {isAudioOnly ? 'Concéntrate en la escucha y pronunciación' : 'Mira atentamente y toma notas'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasWatched && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Visto
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="font-medium mb-2">Consejos de Aprendizaje:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {isAudioOnly ? (
                <>
                  <li>• Escucha atentamente la pronunciación</li>
                  <li>• Repite las palabras y frases que escuches</li>
                  <li>• Presta atención al acento y la entonación</li>
                  <li>• Practica hablando junto con el audio</li>
                </>
              ) : (
                <>
                  <li>• Mira el video al menos una vez completamente</li>
                  <li>• Presta atención al lenguaje corporal y al contexto</li>
                  <li>• Toma notas del nuevo vocabulario</li>
                  <li>• Practica las expresiones que aprendas</li>
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
            {hasWatched ? 'Continuar a las Preguntas' : `${isAudioOnly ? 'Escucha' : 'Mira'} el ${isAudioOnly ? 'audio' : 'video'} primero`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;