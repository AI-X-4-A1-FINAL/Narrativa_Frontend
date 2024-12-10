import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";
import { LocationState } from "../utils/messageTypes";
import { ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useBackgroundImage } from "../hooks/useBackgroundImage";
import { useGameStage } from "../hooks/useGameStage";
import GameStageIndicator from "./GameStageIndicator";
import axios from "../api/axiosInstance";
import { Cookies } from "react-cookie";
import { parseCookieKeyValue } from "../api/cookie";
import ChatBot from "./ChatBot"; // ChatBot 컴포넌트 추가

// 타입 정의
interface GameState {
  mainMessage: string;
  choices: string[];
  gameId?: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, userId } = location.state as LocationState;

  // 상태 관리
  const [gameState, setGameState] = useState<GameState>({
    mainMessage: "",
    choices: [],
    gameId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChoicesDisplayed, setIsChoicesDisplayed] = useState(false);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false); // ChatBot 표시 상태

  // 인증 및 유틸리티
  const { isAuthenticated } = useAuth();
  const { isPlaying, togglePlayPause, initializeMusic } = useAudio();
  const { bgImage, generateImage } = useBackgroundImage(image);
  const { currentStage, goToNextStage } = useGameStage({
    maxStages: 5,
    onStageChange: () => initializeMusic(genre),
  });

  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  // 선택지 표시 상태 업데이트
  useEffect(() => {
    if (!isLoading && !error && gameState.choices.length > 0) {
      setIsChoicesDisplayed(true);
      setIsChatBotVisible(true); // ChatBot 표시
    }
  }, [isLoading, error, gameState.choices]);

  // 게임 시작
  useEffect(() => {
    const startGame = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "/generate-story/start",
          { genre, tags, userId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        setGameState({
          mainMessage: "",
          choices: response.data.choices || [],
          gameId: response.data.gameId,
        });

        // 스토리 초기화
        const words = response.data.story.split(" ");
        updateStoryTextByWord(response.data.story, words, 0);
      } catch (err) {
        console.error("Error starting game:", err);
        setError("게임을 시작하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    startGame();
  }, [genre, tags, userId, accessToken]);

  // 스토리 텍스트 한 단어씩 업데이트
  const updateStoryTextByWord = (
    story: string,
    words: string[],
    index: number
  ) => {
    if (index < words.length) {
      setGameState((prev) => ({
        ...prev,
        mainMessage: prev.mainMessage + " " + words[index],
      }));
      setTimeout(() => updateStoryTextByWord(story, words, index + 1), 100);
    }
  };

  // 선택 처리
  const handleChoice = async (choiceText: string) => {
    if (!gameState.gameId) {
      setError("게임 ID가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        genre,
        userSelect: choiceText,
        gameId: gameState.gameId,
      };

      if (currentStage < 4) {
        await generateImage(choiceText, genre, gameState.gameId, currentStage);
      } else {
        const endPayload = {
          genre,
          userChoice: choiceText,
          gameId: gameState.gameId,
        };
        const generatedImage = await generateImage(
          choiceText,
          genre,
          gameState.gameId,
          currentStage
        );
        const endResponse = await axios.post(
          "/generate-story/end",
          endPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        navigate("/game-ending", {
          state: {
            image: generatedImage?.data,
            prompt: endResponse.data.story,
            genre,
          },
        });
        return;
      }

      const response = await axios.post("/generate-story/chat", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      setGameState({
        mainMessage: "",
        choices: response.data.choices || [],
        gameId: gameState.gameId,
      });

      const words = response.data.story.split(" ");
      updateStoryTextByWord(response.data.story, words, 0);

      if (currentStage < 4) {
        goToNextStage();
      }
    } catch (error) {
      console.error("Error processing choice:", error);
      setError("선택 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative w-full h-screen text-white overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={`Stage ${currentStage + 1}`}
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      {/* 상단 네비게이션 */}
      <div className="absolute top-4 flex justify-between w-full px-4">
        <button
          onClick={togglePlayPause}
          className="bg-gray-800 p-2 rounded-full"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <GameStageIndicator currentStage={currentStage} maxStages={5} />
        <button
          onClick={() =>
            navigate("/game-intro", { state: { genre, tags, image } })
          }
          className="bg-gray-800 p-2 rounded-full"
        >
          <ArrowBigLeftDash size={20} />
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        {/* 선택지 영역 */}
        <div className="flex-1 flex justify-center items-center">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="w-full max-w-2xl space-y-4">
              {gameState.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full bg-gray-800 text-white p-4 rounded-lg"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 챗봇 */}
        {isChatBotVisible && (
          <div className="fixed bottom-4 right-4 z-50">
            <ChatBot />
          </div>
        )}

        {/* 하단 메시지 */}
        <div className="bg-gray-800 p-4 rounded-lg">
          {gameState.mainMessage}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
