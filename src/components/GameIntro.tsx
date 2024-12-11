import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LocationState } from "../utils/messageTypes";

import { trackEvent } from "../utils/analytics";

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
      // 게임 시작 이벤트 추적
      trackEvent.gameStart(genre);

      navigate("/game-world-view", {
        state: {
          genre,
          tags,
          image,
          initialStory: "",
          isLoading: true,
          userId,
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      {/* Image Container */}
      <div className="w-full max-w-lg relative group">
        <div>
          <img
            src={image}
            alt={genre}
            className="w-full h-[400px] object-cover rounded-2xl shadow-xl 
            transform group-hover:scale-[1.01] transition duration-300"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="text-center text-black dark:text-white w-full max-w-lg">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">
          {genre} Game
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {Array.isArray(tags) &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm font-semibold px-4 py-1.5 rounded-full
                bg-gray-700 dark:bg-gray-300 text-white dark:text-black shadow-md"
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* Description */}
        <p
          className="text-base leading-relaxed mb-6 p-4 rounded-2xl 
        bg-white/80 dark:bg-gray-800/80 shadow-xl dark:shadow-gray-950"
        >
          매혹적인{" "}
          <span className="text-custom-violet font-semibold">{genre}</span>{" "}
          세계에서
          <br />
          당신만의 <span className="text-red-500 font-extrabold">선택</span>으로
          유일한 이야기를 써내려가세요.
        </p>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="relative px-8 py-1 rounded-xl font-extrabold animate-pulse 
          text-gray-700 dark:text-white transform hover:scale-105 active:scale-105 transition-all duration-300 text-4xl"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameIntro;
