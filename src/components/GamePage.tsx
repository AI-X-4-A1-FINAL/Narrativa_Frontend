import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";
import { LocationState } from "../utils/messageTypes";
import { ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useBackgroundImage } from "../hooks/useBackgroundImage";
import { useGameStage } from "../hooks/useGameStage";
import GameStageIndicator from './GameStageIndicator';
import axios from "../api/axiosInstance";

// 타입 정의
interface Choice {
  id: number;
  text: string;
}

interface GameState {
  mainMessage: string;
  choices: string[];
  storyId?: string;
  gameId?: number;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, userId } = location.state as LocationState;

  // 상태 관리
  const [gameState, setGameState] = useState<GameState>({
    mainMessage: "",
    choices: [],
    storyId: undefined,
    gameId: undefined
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 인증
  const { isAuthenticated } = useAuth();

  // 오디오
  const { isPlaying, togglePlayPause, initializeMusic } = useAudio();

  // 배경 이미지
  const { bgImage, generateImage } = useBackgroundImage(image);

  // 게임 스테이지
  const { currentStage, goToNextStage } = useGameStage({
    maxStages: 5,
    onStageChange: () => initializeMusic(genre),
  });

  // 초기 게임 시작
  useEffect(() => {
    const startGame = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post("/generate-story/start", {
          genre,
          tags,
          userId,
        });

        setGameState({
          mainMessage: response.data.story,
          choices: response.data.choices || [],
          storyId: response.data.story_id,
          gameId: response.data.gameId,
        });
      } catch (err) {
        console.error("Error starting game:", err);
        setError("게임을 시작하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      startGame();
      
    }
  }, [genre, tags, userId, isAuthenticated]);

  // 선택지 선택 처리
  const handleChoice = async (choiceText: string) => {
    if (!gameState.storyId || !gameState.gameId) {
      setError("스토리 ID 또는 게임 ID가 없습니다.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const payload = {
        genre,
        userSelect: choiceText,  // 선택한 텍스트
        gameId: gameState.gameId
      };

      if(currentStage < 4){

        generateImage(choiceText, genre);


      } else {
        const generatedImage = await generateImage(choiceText, genre);
        const endResponse = await axios.post("/generate-story/end", payload);


        navigate("/game-ending", { state: { 
                                    image: generatedImage?.data,
                                    prompt: endResponse.data.story,
                                    genre : genre,

                                  },
                                 });
                                 return;
      }


      
  
      const response = await axios.post("/generate-story/chat", payload);
      //alert(choiceText)
      

  
      setGameState({
        mainMessage: response.data.story,
        choices: response.data.choices || [], // 여기서 Choice[] 타입의 배열을 받아야 함
        storyId: gameState.storyId,
        gameId: gameState.gameId,
      });

      //generateImage(response.data.story, genre)
      //alert(response.data.story)
  
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

  // 인증 체크
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gray-800 text-white overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={`Stage ${currentStage + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* 상단 컨트롤 */}
      <div className="absolute top-4 flex justify-between w-full px-4 z-30">
        <button
          onClick={togglePlayPause}
          className="bg-custom-purple text-white w-10 h-10 rounded-full hover:bg-custom-violet transition-colors flex items-center justify-center shadow-2xl"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <GameStageIndicator currentStage={currentStage} maxStages={5} />
        <button
          onClick={() => {
            if (window.confirm("정말 나가시겠습니까?")) {
              navigate("/game-intro", { state: { genre, tags, image } });
            }
          }}
          className="bg-custom-purple text-white w-10 h-10 rounded-full hover:bg-custom-violet transition-colors flex items-center justify-center shadow-2xl"
        >
          <ArrowBigLeftDash />
        </button>
      </div>

      {/* 게임 콘텐츠 컨테이너 */}
      <div className="absolute inset-0 flex flex-col items-center justify-between pt-20 pb-8 px-4">
        {/* 중앙 선택지 영역 */}
        <div className="flex-1 w-full max-w-2xl flex items-center justify-center min-h-[50vh]">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 underline"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="w-full space-y-5">
            {gameState.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)} 
              className="w-full bg-custom-purple bg-opacity-85 text-white py-4 px-6 
                        rounded-lg hover:bg-custom-violet shadow-2xl
                        transition-colors duration-200 text-left"
            >
              {choice} 
            </button>
          ))}
          </div>
          )}
        </div>

        {/* 하단 메시지 영역 */}
        <div className="w-full max-w-2xl">
          <div className="bg-custom-purple bg-opacity-90 rounded-lg p-6 mb-6 shadow-2xl">
            <div className="text-base leading-relaxed">
              {gameState.mainMessage || "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
