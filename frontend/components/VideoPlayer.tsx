// components/VideoPlayer.tsx
'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  streamUrl: string;
  poster?: string;
  autoplay?: boolean;
}

export default function VideoPlayer({ streamUrl, poster, autoplay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        autoplay: autoplay,
        controls: true,
        responsive: true,
        fluid: true,
        liveui: true,
        poster: poster,
        html5: {
          vhs: {
            overrideNative: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
        sources: [{
          src: streamUrl,
          type: 'application/x-mpegURL'
        }]
      }));

      // Player events
      player.on('error', () => {
        console.error('Video.js error:', player.error());
      });

      player.on('loadedmetadata', () => {
        console.log('Stream loaded');
      });

    } else {
      // Update source if streamUrl changes
      const player = playerRef.current;
      player.src({ src: streamUrl, type: 'application/x-mpegURL' });
    }
  }, [streamUrl, autoplay, poster]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}