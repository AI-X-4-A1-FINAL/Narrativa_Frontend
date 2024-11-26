import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import AuthGuard from "../api/accessControl";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
}

const GameIntro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { genre, tags, image } = (location.state as LocationState) || {};
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);

  const handleStart = async () => {
    if (!genre) {
      alert("Genre information is missing!");
      return;
    }

    try {
      // 초기화
      navigate("/game-page", {
        state: {
          genre,
          tags,
          image,
          initialStory: "", // 초기화
        },
      });

      // 새 스토리 요청
      const response = await axios.post("/generate-story/start", {
        genre,
        tags,
      });

      // 새로운 값으로 업데이트
      navigate("/game-page", {
        state: {
          genre,
          tags,
          image,
          initialStory: response.data.story, // 새로 받아온 스토리 저장
        },
      });
    } catch (error) {
      console.error("Error starting the game:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("cookies.id", cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }

    if (!checkAuth(cookies.id)) {
      navigate("/"); // 유저 상태코드 유효하지 않으면 접근
    }
  }, []);

  return (
    <div className="">
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-lg mb-6">
        <img
          src={image}
          alt={genre}
          className="w-full h-[400px] object-cover rounded-2xl"
        />
      </div>
      <div className="text-center text-black mb-4 dark:text-white">
        <h1 className="text-3xl font-bold mb-2">{genre} Game</h1>
        <div className="mb-4">
          {Array.isArray(tags) &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block text-sm font-semibold mr-2 px-3 py-1 rounded-full bg-gray-200 dark:text-black"
              >
                #{tag}
              </span>
            ))}
        </div>
        <p>
          여기는 <span className="font-semibold">{genre}</span> 게임의 소개
          페이지입니다.
          <br />
          게임의 목적과 배경 설명이 이곳에 추가될 예정입니다.
          <br />
          준비가 되셨다면 시작 버튼을 눌러 주세요!
        </p>
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={handleStart}
          className="bg-custom-violet text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 dark:bg-custom-purple"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameIntro;
