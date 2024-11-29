// musicManager.ts
import { useState, useRef } from "react";
import axios from "../api/axiosInstance";

// 음악 URL을 관리하는 커스텀 훅
export const useMusicManager = (initialGenre: string | null) => {
  const [musicUrl, setMusicUrl] = useState<string | null>(null); // 음악 URL 상태
  const [musicLoading, setMusicLoading] = useState<boolean>(false); // 로딩 상태
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // 음악 재생 상태
  const audioRef = useRef<HTMLAudioElement | null>(null); // 오디오 참조

  // 음악을 불러오는 함수
  const fetchMusic = async (genre: string) => {
    setMusicLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/music/random?genre=${genre}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMusicUrl(data.url); // 음악 URL 설정
    } catch (error) {
      console.error("Error fetching music URL:", error);
      setMusicUrl(null); // 음악 URL 초기화
    } finally {
      setMusicLoading(false);
    }
  };

  // 음악을 제어하는 함수 (재생/일시정지)
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 음악이 로드된 후 자동 재생
  const autoPlayMusic = () => {
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch((error) => {
        console.error("Auto-play was prevented:", error);
      });
      setIsPlaying(true); // 재생 상태 업데이트
    }
  };

  // 음악 URL을 변경하는 함수
  const updateMusicUrl = (url: string) => {
    setMusicUrl(url);
  };

  return {
    musicUrl,
    musicLoading,
    isPlaying,
    audioRef,
    fetchMusic,
    togglePlayPause,
    autoPlayMusic,
    updateMusicUrl,
  };
};
