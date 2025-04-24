'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface NowPlaying {
  isPlaying: boolean;
  name?: string;
  artist?: string;
  albumArt?: string;
}

// Token kopyalama componenti
const TokenCopyButton = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToken = async () => {
    try {
      const response = await fetch('/api/token');
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Token alınamadı');
        return;
      }
      
      const { token } = await response.json();
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('token', token);
      await navigator.clipboard.writeText(currentUrl.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Token copy error:', error);
      setError('Token kopyalanırken hata oluştu');
    }
  };

  return (
    <div className="obs-container">
      <div className="obs-now-playing">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <button 
            onClick={copyToken}
            className="text-white hover:text-green-400 transition-colors cursor-pointer bg-transparent border-none p-2"
          >
            {copied ? '✅ OBS URL Kopyalandı!' : '🔗 OBS için URL Oluştur'}
          </button>
        )}
      </div>
    </div>
  );
};

// Login component'i ekleyelim
const LoginButton = () => (
  <div className="obs-container">
    <div className="obs-now-playing">
      <a 
        href="/api/auth"
        className="text-white hover:text-green-400 transition-colors"
        style={{ textDecoration: 'none' }}
      >
        Spotify'a Bağlan
      </a>
    </div>
  </div>
);

const ClassicOverlay = ({ currentTrack }: { currentTrack: NowPlaying }) => (
  <div className="obs-now-playing track-change-animation">
    <img
      src={currentTrack.albumArt}
      alt={`${currentTrack.name} album art`}
      className="obs-album-art album-art-animation"
    />
    <div className="obs-song-info">
      <h1 className="obs-song-name">{currentTrack.name}</h1>
      <p className="obs-artist-name">{currentTrack.artist}</p>
    </div>
  </div>
);

const MinimalOverlay = ({ currentTrack }: { currentTrack: NowPlaying }) => (
  <div className="obs-now-playing track-change-animation" style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '10px' }}>
    <div className="obs-song-info">
      <p className="obs-song-name">{currentTrack.name}</p>
      <p className="obs-artist-name">{currentTrack.artist}</p>
    </div>
  </div>
);

const CompactOverlay = ({ currentTrack }: { currentTrack: NowPlaying }) => (
  <div className="obs-now-playing track-change-animation" style={{ padding: '8px' }}>
    <img
      src={currentTrack.albumArt}
      alt={`${currentTrack.name} album art`}
      className="obs-album-art album-art-animation"
      style={{ width: '40px', height: '40px' }}
    />
    <div className="obs-song-info">
      <p className="obs-song-name" style={{ fontSize: '14px' }}>{currentTrack.name}</p>
      <p className="obs-artist-name" style={{ fontSize: '12px' }}>{currentTrack.artist}</p>
    </div>
  </div>
);

const AnimatedOverlay = ({ currentTrack }: { currentTrack: NowPlaying }) => (
  <div className="obs-now-playing track-change-animation hover:scale-105 transition-all duration-300">
    <img
      src={currentTrack.albumArt}
      alt={`${currentTrack.name} album art`}
      className="obs-album-art album-art-animation hover:rotate-12 transition-transform duration-300"
    />
    <div className="obs-song-info">
      <p className="text-green-400 text-sm font-medium mb-1">Now Playing</p>
      <p className="obs-song-name">{currentTrack.name}</p>
      <p className="obs-artist-name">{currentTrack.artist}</p>
    </div>
  </div>
);

// OverlayWrapper component'i güncelleyelim
const OverlayWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="obs-container">
    {children}
  </div>
);

export default function Overlay() {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const style = searchParams.get('style') || 'classic';
  const token = searchParams.get('token');

  useEffect(() => {
    const checkNowPlaying = async () => {
      try {
        const url = token 
          ? `/api/spotify?token=${token}`
          : '/api/spotify';

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          setError(`API Error: ${errorData.error || response.statusText}`);
          return;
        }
        
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }

        if (!data.isPlaying) {
          setTrack(null);
          return;
        }

        setTrack(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    checkNowPlaying();
    const interval = setInterval(checkNowPlaying, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // Hata durumunda göster
  if (error) {
    return (
      <OverlayWrapper>
        <div className="text-red-500 text-sm">
          <p>Bağlantı hatası: {error}</p>
        </div>
      </OverlayWrapper>
    );
  }

  // Şarkı çalmıyorsa gizle
  if (!track) {
    return null;
  }

  // Stil seçimi
  const content = (() => {
    switch (style) {
      case 'minimal':
        return <MinimalOverlay currentTrack={track} />;
      case 'compact':
        return <CompactOverlay currentTrack={track} />;
      case 'animated':
        return <AnimatedOverlay currentTrack={track} />;
      default:
        return <ClassicOverlay currentTrack={track} />;
    }
  })();

  return <OverlayWrapper>{content}</OverlayWrapper>;
} 