import React, { createContext, useContext, useState, useRef } from 'react';

interface AudioContextType {
  musicUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  initializeMusic: (genre: string) => Promise<void>;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeMusic = async (genre: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/music/random?genre=${genre}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMusicUrl(data.url);
      
      // 음악 URL이 설정되면 자동 재생 시도
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Auto-play was prevented:", error);
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Error fetching music:", error);
      setError("음악을 불러오는데 실패했습니다.");
      setMusicUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Play failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AudioContext.Provider 
      value={{ 
        musicUrl, 
        isPlaying, 
        isLoading,
        error,
        initializeMusic,
        togglePlayPause 
      }}
    >
      {musicUrl && <audio 
        ref={audioRef} 
        src={musicUrl}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setError("음악 재생 중 오류가 발생했습니다.");
          setIsPlaying(false);
        }}
      />}
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};