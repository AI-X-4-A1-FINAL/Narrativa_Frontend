import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

interface BGMContextProps {
  isPlaying: boolean;
  toggleBGM: () => void;
}

const BGMContext = createContext<BGMContextProps | undefined>(undefined);

export const BGMProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleBGM = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) => console.error("Audio play error:", err));
      }
    }
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 오디오 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <BGMContext.Provider value={{ isPlaying, toggleBGM }}>
      <audio
        ref={audioRef}
        src="/audios/BGM6.mp3" // 배경음악 파일 경로
        loop
        preload="auto"
      />
      {children}
    </BGMContext.Provider>
  );
};

export const useBGM = () => {
  const context = useContext(BGMContext);
  if (!context) {
    throw new Error("useBGM must be used within a BGMProvider");
  }
  return context;
};
