// app/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { inputClassName, buttonClassName } from '@/lib/styles/design-system';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/events`, formData);
      setCreatedEvent(response.data);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.error || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  };

  if (createdEvent) {
    return (
      <div className="min-h-screen bg-dust">
        <nav className="bg-dust border-b border-ash border-opacity-30 shadow-worn sticky top-0 z-50">
          <div className="container flex items-center h-16">
            <Link href="/" className="text-stone hover:text-concrete transition-colors">
              ← Volver
            </Link>
          </div>
        </nav>

        <div className="container max-w-3xl py-12">
          <div className="card elevated p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-signal bg-opacity-20 rounded-soft flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-headline-lg font-medium text-stone mb-2">¡Evento Creado!</h2>
              <p className="text-body text-concrete">Configura tu OBS con estos datos para comenzar a transmitir</p>
            </div>

            <div className="space-y-6">
              {/* RTMP URL */}
              <div className="bg-fog p-4 rounded-default">
                <label className="block text-label font-medium text-stone mb-2">
                  URL del Servidor RTMP
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createdEvent.rtmpUrl}
                    readOnly
                    className={inputClassName() + ' font-mono'}
                  />
                  <button
                    onClick={() => copyToClipboard(createdEvent.rtmpUrl)}
                    className={buttonClassName('primary', 'md')}
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Stream Key */}
              <div className="bg-fog p-4 rounded-default">
                <label className="block text-label font-medium text-stone mb-2">
                  Clave de Transmisión (Stream Key)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createdEvent.streamKey}
                    readOnly
                    className={inputClassName() + ' font-mono'}
                  />
                  <button
                    onClick={() => copyToClipboard(createdEvent.streamKey)}
                    className={buttonClassName('primary', 'md')}
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-caption text-rust mt-2">
                  ⚠️ Mantén esta clave privada. Cualquiera con esta clave puede transmitir a tu evento.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-signal bg-opacity-10 border border-signal border-opacity-30 p-4 rounded-default">
                <h3 className="font-medium text-stone mb-3">📝 Instrucciones para OBS Studio</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-stone">
                  <li>Abre OBS Studio</li>
                  <li>Ve a Configuración → Emisión</li>
                  <li>Selecciona "Servicio: Personalizado"</li>
                  <li>Pega la URL del servidor en "Servidor"</li>
                  <li>Pega la clave de transmisión en "Clave de Retransmisión"</li>
                  <li>Haz clic en "Iniciar Transmisión"</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Link
                  href={`/watch/${createdEvent.event.id}`}
                  className={buttonClassName('primary', 'md') + ' flex-1 justify-center'}
                >
                  Ver Evento
                </Link>
                <Link
                  href="/"
                  className={buttonClassName('secondary', 'md') + ' flex-1 justify-center'}
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dust">
      <nav className="bg-dust border-b border-ash border-opacity-30 shadow-worn sticky top-0 z-50">
        <div className="container flex items-center h-16">
          <Link href="/" className="text-stone hover:text-concrete transition-colors">
            ← Volver
          </Link>
        </div>
      </nav>

      <div className="container max-w-2xl py-12">
        <div className="card elevated p-8">
          <h2 className="text-display-sm font-medium text-stone mb-6">Crear Nuevo Evento</h2>

          {error && (
            <div className="bg-rust bg-opacity-10 border border-rust border-opacity-30 text-rust px-4 py-3 rounded-default mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-label font-medium text-stone mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Partido amistoso - Club Local vs Visitante"
                className={inputClassName()}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-label font-medium text-stone mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el evento, equipos participantes, horario, etc."
                className={inputClassName()}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={buttonClassName('primary', 'md') + ' w-full justify-center'}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}