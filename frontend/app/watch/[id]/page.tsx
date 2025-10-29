// app/watch/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import VideoPlayer as client-only component
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Event {
  id: number;
  title: string;
  description: string;
  status: string;
  started_at: string;
  hls_url: string;
}

export default function WatchPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchEvent();
      // Poll for status updates every 10 seconds
      const interval = setInterval(fetchEvent, 10000);
      return () => clearInterval(interval);
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/${params.id}`);
      setEvent(response.data.event);
      setError('');
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Error al cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Cargando stream...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Evento no encontrado'}</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="text-white hover:text-gray-300">
              ← Volver
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              {event.status === 'live' && event.hls_url ? (
                <VideoPlayer 
                  streamUrl={event.hls_url}
                  autoplay={true}
                />
              ) : event.status === 'scheduled' ? (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl font-semibold">Transmisión Programada</p>
                    <p className="text-gray-400 mt-2">El evento aún no ha comenzado</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <p className="text-xl font-semibold">Transmisión Finalizada</p>
                    <p className="text-gray-400 mt-2">Este evento ya terminó</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                {event.status === 'live' && (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold uppercase animate-pulse">
                    ● EN VIVO
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-gray-300 text-lg">{event.description}</p>
              )}
              {event.started_at && (
                <p className="text-gray-500 text-sm mt-2">
                  Inicio: {new Date(event.started_at).toLocaleString('es-AR')}
                </p>
              )}
            </div>
          </div>

          {/* Chat/Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Información</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-semibold capitalize">{event.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID del Evento</p>
                  <p className="font-mono text-sm">{event.id}</p>
                </div>
                {event.hls_url && (
                  <div>
                    <p className="text-sm text-gray-500">URL de Stream</p>
                    <p className="font-mono text-xs break-all bg-gray-900 p-2 rounded">
                      {event.hls_url}
                    </p>
                  </div>
                )}
              </div>

              {/* Coming soon: Chat */}
              <div className="mt-8 p-4 bg-gray-900 rounded text-center">
                <p className="text-gray-500 text-sm">Chat en vivo próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}