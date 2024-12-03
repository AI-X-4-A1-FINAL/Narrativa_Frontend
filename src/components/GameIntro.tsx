import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
}

const GameIntro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { genre, tags, image } = (location.state as LocationState) || {};
  const { userId, isAuthenticated, logout } = useAuth();

  const handleStart = async () => {
    if (!genre) {
      alert("Genre information is missing!");
      return;
    }

    if (!isAuthenticated) {
      alert("인증이 필요합니다. 다시 로그인해주세요.");
      logout();
      return;
    }

    try {
      navigate("/game-world-view", {
        state: {
          genre,
          tags,
          image,
          initialStory: "",
          isLoading: true,
          userId
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-950 mb-6">
        <img
          src={image}
          alt={genre}
          className="w-full h-[400px] object-cover rounded-2xl "
        />
      </div>
      <div className="text-center text-black mb-4 dark:text-white">
        <h1 className="text-3xl font-bold mb-2">
          {genre} Game
        </h1>
        <div className="my-2">
          {Array.isArray(tags) &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block text-sm font-semibold my-2 mr-2 px-3 py-1 rounded-full bg-gray-200 dark:text-black"
              >
                #{tag}
              </span>
            ))}
        </div>
        <p className="text-center text-base leading-relaxed my-2 p-4 rounded-2xl shadow-lg dark:shadow-gray-950
        bg-gray-50 dark:bg-gray-800 dark:text-white">
          다양한{" "}
          <span className="text-custom-violet font-semibold">{genre}</span> 세계
          속 당신의 <span className="text-red-500 font-extrabold">선택</span>이
          이야기를 만듭니다.
          <br />
          5개의 흥미진진한 스테이지가 당신을 기다립니다!
          <br />
          <span className="my-1 text-lg">
            준비가 되셨다면, 여정을 시작해보세요!
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleStart}
          className="bg-custom-violet text-white font-bold py-2 px-6 rounded-lg shadow-lg dark:shadow-gray-950
          hover:bg-blue-700 transition duration-200 dark:bg-custom-purple"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameIntro;