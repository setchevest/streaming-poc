// app/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Volver
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Evento Creado!</h2>
              <p className="text-gray-600">Configura tu OBS con estos datos para comenzar a transmitir</p>
            </div>

            <div className="space-y-6">
              {/* RTMP URL */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL del Servidor RTMP
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={createdEvent.rtmpUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded font-mono text-sm"
                  />
                  <button 
                    onClick={() => copyToClipboard(createdEvent.rtmpUrl)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Stream Key */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Clave de Transmisión (Stream Key)
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={createdEvent.streamKey}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded font-mono text-sm"
                  />
                  <button 
                    onClick={() => copyToClipboard(createdEvent.streamKey)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Mantén esta clave privada. Cualquiera con esta clave puede transmitir a tu evento.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">📝 Instrucciones para OBS Studio</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
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
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-semibold transition"
                >
                  Ver Evento
                </Link>
                <Link 
                  href="/"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-center py-3 rounded-lg font-semibold transition"
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Volver
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Crear Nuevo Evento</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Partido amistoso - Club Local vs Visitante"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el evento, equipos participantes, horario, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}