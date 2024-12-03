import { useState, useRef } from 'react';
import axios from '../api/axiosInstance';

interface UseBackgroundImageReturn {
  bgImage: string;
  isLoading: boolean;
  generateImage: (script: string) => Promise<void>;
}

export const useBackgroundImage = (initialImage: string) => {
  const [bgImage, setBgImage] = useState<string>(initialImage || "/images/game-start.jpeg");
  const [isLoading, setIsLoading] = useState(false);
  const imageFetched = useRef(false);

  const generateImage = async (script: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/images/generate-image", {
        prompt: script,
        size: "1024x1024",
        n: 1,
      });
      setBgImage(response.data);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { bgImage, isLoading, generateImage };
};