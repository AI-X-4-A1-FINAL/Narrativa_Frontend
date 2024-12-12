import { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";
import { parseCookieKeyValue } from "../api/cookie";
import { Cookies } from "react-cookie";
import { arrayBuffer } from "stream/consumers";

interface UseBackgroundImageReturn {
  bgImage: string;
  isLoading: boolean;
  generateImage: (
    script: string,
    genre: string,
    gameId: string,
    stageNumber: number
  ) => Promise<{
    imageData: string;
    text: string;
    genre: string;
  } | null>;
}

export const useBackgroundImage = (initialImage: string): UseBackgroundImageReturn => {
  const [bgImage, setBgImage] = useState<string>(
    initialImage || "/images/game-start.jpeg"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const imageFetched = useRef(false);

  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  const generateImage = async (
    script: string,
    genre: string,
    gameId: string,
    stageNumber: number
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SPRING_URI}/api/images/generate-image`,
        {
          gameId: gameId,
          stageNumber: stageNumber + 1,
          prompt: script,
          size: "9:16",
          n: 1,
          genre: genre,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      const imageData = response.data.image;
      if (imageData) {
        setBgImage(imageData);
        const needData = JSON.parse(response.config.data);
        
        return {
          imageData: imageData,
          text: needData.prompt,
          genre: needData.genre
        };
      } else {
        console.error("No image data received from the server.");
        return null;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBackgroundImage = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/images/random`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBgImage(data.imageUrl);
    } catch (error) {
      console.error("Error fetching background image:", error);
      setBgImage("/images/pikachu.webp");
    }
  };

  useEffect(() => {
    fetchBackgroundImage();
  }, []);

  return { bgImage, isLoading, generateImage };
};
