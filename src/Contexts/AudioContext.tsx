import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  musicUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  initializeMusic: (genre: string, autoPlay?: boolean) => Promise<void>;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const initializingRef = useRef<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError("음악 재생 중 오류가 발생했습니다.");
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const initializeMusic = async (genre: string, autoPlay: boolean = false) => {
    if (initializingRef.current) return;
    initializingRef.current = true;

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
      
      // 이전 오디오 중지
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // 새 URL 설정
      setMusicUrl(data.url);
      audioRef.current.src = data.url;
      
      // autoPlay가 true이고 사용자 상호작용이 있었을 때만 자동 재생 시도
      if (autoPlay) {
        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        } catch (error) {
          // 자동 재생 실패는 에러로 처리하지 않음
          console.log("Auto-play not allowed, waiting for user interaction");
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Error fetching music:", error);
      setError("음악을 불러오는데 실패했습니다.");
      setMusicUrl(null);
    } finally {
      setIsLoading(false);
      initializingRef.current = false;
    }
  };

  const togglePlayPause = async () => {
    if (!musicUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Play/Pause failed:", error);
      setIsPlaying(false);
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