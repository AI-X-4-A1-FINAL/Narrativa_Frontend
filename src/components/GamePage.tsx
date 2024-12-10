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
import ChatBot from "./ChatBot";
import { trackEvent } from "../utils/analytics";

interface Choice {
  id: number;
  text: string;
}

interface GameState {
  mainMessage: string;
  choices: string[];
  gameId?: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, userId, initialStory } =
    location.state as LocationState;
  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  const [gameStartTime] = useState(new Date());
  const [gameState, setGameState] = useState<GameState>({
    mainMessage: "",
    choices: [],
    gameId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [isChoicesVisible, setIsChoicesVisible] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);

  const { isAuthenticated } = useAuth();
  const { isPlaying, togglePlayPause, initializeMusic } = useAudio();
  const { bgImage, generateImage } = useBackgroundImage(image);
  const { currentStage, goToNextStage } = useGameStage({
    maxStages: 5,
    onStageChange: () => initializeMusic(genre),
  });

  useEffect(() => {
    return () => {
      const endTime = new Date();
      const duration = (endTime.getTime() - gameStartTime.getTime()) / 1000;
      if (genre) {
        trackEvent.gameEnd(genre, duration);
      }
    };
  }, [genre, gameStartTime]);

  // useEffect(() => {
  //   if (!isLoading && !error && gameState.choices.length > 0) {
  //     setIsChoicesVisible(true);
  //     setIsChatBotVisible(true);
  //   }
  // }, [isLoading, error, gameState.choices]);

  useEffect(() => {
    console.log("isStoryComplete:", isStoryComplete);
    console.log("isChatBotVisible:", isChatBotVisible);
  }, [isStoryComplete, isChatBotVisible]);

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
  }, [genre, tags, userId, accessToken, isAuthenticated, initialStory]);

  const updateStoryTextByWord = (
    story: string,
    words: string[],
    index: number
  ) => {
    if (index < words.length) {
      setGameState((prevState) => ({
        ...prevState,
        mainMessage: prevState.mainMessage + " " + words[index],
      }));
      setTimeout(() => updateStoryTextByWord(story, words, index + 1), 100);
    } else {
      // 스토리 출력이 완료된 상태 설정
      setIsStoryComplete(true);

      // 초이스 버튼 표시 (스토리 출력 완료 후)
      setTimeout(() => {
        setIsChoicesVisible(true);

        // 챗봇 버튼 표시 (초이스 버튼 이후)
        setTimeout(() => {
          setIsChatBotVisible(true);
        }, 500); // 초이스 버튼이 나타난 후 500ms 딜레이
      }, 300); // 초이스 버튼이 스토리 종료 후 300ms 딜레이로 나타남
    }
  };

  const handleChoice = async (choiceText: string) => {
    if (!gameState.gameId) {
      setError("게임 ID가 없습니다.");
      return;
    }

    // 초이스와 챗봇 버튼 숨김
    setIsChoicesVisible(false);
    setIsChatBotVisible(false);
    setIsStoryComplete(false);

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
    } catch (err) {
      console.error("Error processing choice:", err);
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
      {/* 배경 */}
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
          onClick={() =>
            navigate("/game-intro", { state: { genre, tags, image } })
          }
          className="bg-gray-800 p-2 rounded-full"
        >
          <ArrowBigLeftDash size={20} />
        </button>
        <GameStageIndicator currentStage={currentStage} maxStages={5} />
        <button
          onClick={togglePlayPause}
          className="bg-gray-800 p-2 rounded-full"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
      <div className="absolute top-24 left-0 w-full px-4 z-10">
        {/* 스토리 출력창 */}
        <div className="bg-gray-800 bg-opacity-50 p-4 top-24 rounded-lg px-4 z-10">
          {gameState.mainMessage}
        </div>

        {/* 선택지 */}
        {isStoryComplete && isChoicesVisible && (
          <div className="mt-11 flex-1 flex justify-center items-center">
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
                    className="w-full bg-gray-800 bg-opacity-50  text-white p-4 rounded-lg opacity-0 animate-fadeIn transition-transform transform translate-y-4"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* 힌트봇 */}
      {isStoryComplete && isChatBotVisible && (
        <div className="absolute bottom-8 left-0 w-full flex justify-center z-50">
          <ChatBot />
        </div>
      )}
    </div>
  );
};

export default GamePage;
