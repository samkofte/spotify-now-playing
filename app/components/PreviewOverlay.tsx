import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Track {
  name: string;
  artist: string;
  albumArt: string;
}

const SAMPLE_TRACK = {
  name: "Starboy",
  artist: "The Weeknd",
  albumArt: "/previews/starboy.jpg"
};

export const useCurrentTrack = () => {
  const [track, setTrack] = useState<Track>(SAMPLE_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data = await response.json();
        
        if (data.isPlaying && data.name) {
          setTrack({
            name: data.name,
            artist: data.artist,
            albumArt: data.albumArt || SAMPLE_TRACK.albumArt
          });
          setIsPlaying(true);
        } else {
          setTrack(SAMPLE_TRACK);
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error fetching track:', error);
        setTrack(SAMPLE_TRACK);
        setIsPlaying(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000);
    return () => clearInterval(interval);
  }, []);

  return { track, isPlaying };
};

export const ClassicPreview = () => {
  const { track, isPlaying } = useCurrentTrack();
  
  return (
    <div className="flex items-center bg-black/70 p-4 gap-4 w-full h-[100px]">
      <div className={`relative w-16 h-16 bg-gray-800 rounded-md overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
        <Image
          src={track.albumArt}
          alt={`${track.name} album art`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-white text-lg font-bold truncate">{track.name}</div>
        <div className="text-gray-400 truncate">{track.artist}</div>
      </div>
    </div>
  );
};

export const MinimalPreview = () => {
  const { track, isPlaying } = useCurrentTrack();
  
  return (
    <div className={`bg-black/50 px-4 py-2 rounded-full w-full h-[60px] flex items-center ${isPlaying ? 'animate-pulse' : ''}`}>
      <div className="text-white text-sm font-medium overflow-hidden">
        <div className={`truncate ${isPlaying ? 'animate-marquee' : ''}`}>
          {track.name}
          <span className="text-gray-400 mx-2">-</span>
          <span className="text-gray-400">{track.artist}</span>
        </div>
      </div>
    </div>
  );
};

export const CompactPreview = () => {
  const { track, isPlaying } = useCurrentTrack();
  
  return (
    <div className="flex items-center bg-black/60 p-2 rounded-lg gap-2 w-full h-[50px]">
      <div className={`relative w-8 h-8 bg-gray-800 rounded flex-shrink-0 overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
        <Image
          src={track.albumArt}
          alt={`${track.name} album art`}
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="relative w-full">
          <div className={`text-white text-xs font-medium whitespace-nowrap ${isPlaying ? 'animate-marquee' : 'truncate'}`}>
            {track.name} - {track.artist}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnimatedPreview = () => {
  const { track, isPlaying } = useCurrentTrack();
  
  return (
    <div className="w-full h-[100px]">
      <div className={`flex items-center bg-gradient-to-r from-black/80 to-black/60 p-4 gap-4 rounded-lg transition-all duration-500 ${isPlaying ? 'animate-glow' : ''}`}>
        <div className={`relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
          <Image
            src={track.albumArt}
            alt={`${track.name} album art`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className={`text-green-400 text-sm font-medium mb-1 ${isPlaying ? 'animate-pulse' : ''}`}>
            Now Playing
          </div>
          <div className="text-white font-bold overflow-hidden">
            <div className={`truncate ${isPlaying ? 'animate-marquee' : ''}`}>
              {track.name}
              <span className="text-gray-400 mx-2">•</span>
              {track.artist}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 