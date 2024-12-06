
import { useState, useEffect, useRef } from 'react';
import axios from '../api/axiosInstance';
import { parseCookieKeyValue } from '../api/cookie';
import { Cookies } from 'react-cookie';

interface UseBackgroundImageReturn {
  bgImage: string;
  isLoading: boolean;
  generateImage: (script: string) => Promise<void>;
}

export const useBackgroundImage = (initialImage: string) => {
  const [bgImage, setBgImage] = useState<string>(initialImage || "/images/game-start.jpeg");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const imageFetched = useRef(false);

  const cookies = new Cookies();
  const cookieToken = cookies.get('token');
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  // 이미지를 생성하는 함수 (Generate image)
  const generateImage = async (script: string, genre: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SPRING_URI}/api/images/generate-image`, {
        prompt: script,
        size: "256x256",
        n: 1,
        genre : genre
      },
      {
        headers: {
          "Content-Type": "application/json",  // JSON 형식으로 데이터 전송
          "Authorization": `Bearer ${accessToken}`,  // Authorization 헤더에 JWT 토큰 포함
        },
        withCredentials: true,  // 쿠키를 요청에 포함시키기
      }
    );
      setBgImage(response.data);  // API 응답을 배경 이미지로 설정
      console.log(response.config.data)

      const needData = JSON.parse(response.config.data);
      const text = needData.prompt;
      const gen = needData.genre;
      const data = response.data;
      
      return { data, text, gen };
      
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };




  // 랜덤 배경 이미지를 fetch하는 함수
  const fetchBackgroundImage = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/images/random`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received image URL:", data.imageUrl); // 받은 imageUrl 출력
      setBgImage(data.imageUrl); // 서버에서 받은 이미지 URL로 배경 설정
    } catch (error) {
      console.error("Error fetching background image:", error);
      setBgImage("/images/pikachu.webp"); // 에러 시 기본 이미지로 설정
    }
  };

  // 컴포넌트 마운트 시 이미지 불러오기
  useEffect(() => {
    
      fetchBackgroundImage(); // s3에서 랜덤 이미지 불러오기
      
  }, []); // 빈 의존성 배열 -> 컴포넌트가 처음 마운트 될 때만 실행

  return { bgImage, isLoading, generateImage };
};
