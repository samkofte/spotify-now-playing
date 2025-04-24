'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ClassicPreview, MinimalPreview, CompactPreview, AnimatedPreview } from './components/PreviewOverlay';

const OVERLAY_STYLES = [
  {
    id: 'classic',
    name: 'Klasik',
    description: 'Albüm kapağı ve kayan yazı ile klasik görünüm',
    preview: ClassicPreview
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sadece şarkı adı ve sanatçı, şeffaf arka plan',
    preview: MinimalPreview
  },
  {
    id: 'compact',
    name: 'Kompakt',
    description: 'Küçük albüm kapağı ve tek satır metin',
    preview: CompactPreview
  },
  {
    id: 'animated',
    name: 'Animasyonlu',
    description: 'Fade efektleri ve yumuşak geçişler',
    preview: AnimatedPreview
  }
];

const OBS_CUSTOM_CSS = `body { 
  background: transparent !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
}`;

function CopyButton({ text, label }: { text: string; label: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Kopyalandı!'))
      .catch(() => alert('Kopyalama başarısız oldu. Lütfen manuel olarak kopyalayın.'));
  };

  return (
    <button
      onClick={copyToClipboard}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
    >
      {label}
    </button>
  );
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkLogin = async () => {
      try {
        const response = await fetch('/api/me');
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('Login check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const getOverlayUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/overlay?style=${selectedStyle}`;
  };

  const copyToken = async () => {
    try {
      const response = await fetch('/api/token');
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Token alınamadı');
        return;
      }
      
      const { token } = await response.json();
      const obsUrl = new URL(window.location.origin + '/overlay');
      obsUrl.searchParams.set('token', token);
      await navigator.clipboard.writeText(obsUrl.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Token copy error:', error);
      setError('Token kopyalanırken hata oluştu');
    }
  };

  const handleLogout = () => {
    // Cookie'leri temizle
    Cookies.remove('spotify_access_token', { path: '/' });
    Cookies.remove('spotify_refresh_token', { path: '/' });
    
    // State'i güncelle
    setIsLoggedIn(false);
    
    // Sayfayı yeniden yükle
    window.location.href = '/';
  };

  if (isLoggedIn) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Spotify Now Playing Overlay</h1>
          
          {/* Style seçimi */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Overlay Stili Seçin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OVERLAY_STYLES.map((style) => {
                const Preview = style.preview;
                return (
                  <div
                    key={style.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedStyle === style.id
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-black/20 border-2 border-transparent hover:border-green-500/50'
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className="aspect-video bg-black/40 rounded-md mb-3 overflow-hidden flex items-center justify-center">
                      <Preview />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{style.name}</h3>
                    <p className="text-gray-400 text-sm">{style.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OBS CSS Bölümü */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">OBS Özel CSS</h3>
            <div className="bg-gray-800 p-4 rounded-lg space-y-3">
              <textarea
                value={OBS_CUSTOM_CSS}
                readOnly
                className="w-full bg-black/30 text-green-400 p-3 rounded font-mono text-sm min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <div className="flex justify-end">
                <CopyButton text={OBS_CUSTOM_CSS} label="CSS Kodunu Kopyala" />
              </div>
            </div>
            <p className="text-sm text-gray-400">
              * CSS kodunu seçmek için tıklayın veya butonu kullanarak kopyalayın
            </p>
          </div>

          {/* Bağlantı Durumu */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Spotify Bağlantı Durumu</h2>
            <div className="space-y-2">
              <h2 className="text-white text-xl font-semibold">Overlay URL</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getOverlayUrl()}
                  readOnly
                  className="flex-1 bg-black/50 text-green-400 p-3 rounded font-mono text-sm"
                />
                <button
                  onClick={copyToken}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 rounded transition-colors"
                >
                  {copied ? '✅ OBS URL Kopyalandı!' : '🔗 OBS için URL Kopyala'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center p-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-white text-xl font-semibold">Kurulum</h2>
              <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                <li>URL'i kopyalayın</li>
                <li>OBS/Streamlabs'da yeni bir Browser Source ekleyin</li>
                <li>URL'i yapıştırın ve boyutları ayarlayın:
                  <ul className="ml-6 mt-1 text-gray-400 text-sm">
                    <li>Klasik: 400x100 piksel</li>
                    <li>Minimal: 300x60 piksel</li>
                    <li>Kompakt: 250x50 piksel</li>
                    <li>Animasyonlu: 400x100 piksel</li>
                  </ul>
                </li>
                <li>Arkaplan şeffaflığı için Custom CSS ekleyin:
                  <pre className="bg-black/30 p-2 mt-1 rounded text-sm">
                    body {'{ background-color: rgba(0, 0, 0, 0) !important; }'}
                  </pre>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Spotify Now Playing</h1>
            <p className="text-zinc-400">OBS için Spotify şarkı göstergesi</p>
          </div>

          <div className="space-y-4">
            <a 
              href="/api/auth"
              className="block w-full text-center py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Spotify ile Giriş Yap
            </a>
          </div>
        </div>
      </main>
    );
  }
}
