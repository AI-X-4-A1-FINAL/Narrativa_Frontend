
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
}

const GameIntro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { genre, tags, image } = location.state as LocationState;

  const handleStart = () => {
    // 추가적인 데이터 검증이나 로직 삽입 가능
    if (!genre) {
      alert("Genre information is missing!");
      return;
    }

    // Game 페이지로 이동
    navigate("/game-page", {
      state: { genre, tags, image },
    });
  };

  return (
    <div className="">
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-lg mb-6">
        <img
          src={image}
          alt={genre}
          className="w-full h-[400px] object-cover rounded-2xl"
        />
      </div>
      <div className="text-center text-black mb-4">
        <h1 className="text-3xl font-bold mb-2">{genre} Game</h1>
        <div className="mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block text-sm font-semibold mr-2 px-3 py-1 rounded-full bg-gray-200"
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
        className="bg-custom-violet text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Start Game
      </button>
      </div>
    </div>
  );
};

export default GameIntro;
