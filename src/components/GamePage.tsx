import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";
import { LocationState } from "../utils/messageTypes";
import { ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useBackgroundImage } from "../hooks/useBackgroundImage";
import { useGameStage } from "../hooks/useGameStage";
import { useGameChat } from "../hooks/useGameChat";
import GameStageIndicator from './GameStageIndicator';

// 목데이터 타입 정의
interface Choice {
  id: number;
  text: string;
}

interface GameState {
  mainMessage: string;
  choices: Choice[];
}

// 목데이터
const mockGameData: GameState = {
  mainMessage: "당신은 현재 대규모 지진으로 인해 도시가 완전히 파괴된 상황에 처해 있습니다. 주변에는 무너진 건물과 파열된 도로, 그리고 도움을 청하는 사람들의 비명소리가 들려옵니다. 이제 당신이 어떤 선택을하느냐에 따라 생존 가능성이 달라질 것입니다.",
  choices: [
    { id: 1, text: "가까운 건물로 피신하여 안전을 확보한다." },
    { id: 2, text: "주변을둘러보며 생존자들을 찾는다." },
    { id: 3, text: "도시를 빠져나가려 시도한다." }
  ]
};

const stages = [
  { content: "Final Stage! Stage 1!" },
  { content: "You're now in Stage 2!" },
  { content: "Keep going! Stage 3!" },
  { content: "Almost there! Stage 4!" },
  { content: "Final Stage! Stage 5!" },
];

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory, userInput: initialUserInput, previousUserInput } =
    location.state as LocationState;

  // 상태 관리
  const [gameState, setGameState] = React.useState<GameState>(mockGameData);
  const [showChoices, setShowChoices] = React.useState(true);

  // 인증
  const { isAuthenticated } = useAuth();

  // 오디오
  const { isPlaying, togglePlayPause, initializeMusic } = useAudio();

  // 배경 이미지
  const { bgImage, isLoading: imageLoading, generateImage } = useBackgroundImage(image);

  // 게임 스테이지
  const { currentStage, goToNextStage, goToPreviousStage } = useGameStage({
    maxStages: stages.length,
    onStageChange: () => initializeMusic(genre),
  });

  // 게임 채팅
  const {
    userInput,
    setUserInput,
    currentMessages,
    inputCount,
    inputDisabled,
    loading: chatLoading,
    responses,
    sendMessage,
    messagesEndRef,
  } = useGameChat({
    genre,
    currentStage,
    initialStory,
    previousUserInput,
    tags,
    image,
  });

  // 선택지 선택 처리
  const handleChoice = (choiceId: number) => {
    setShowChoices(false);
  };

  // 이미지 자동 생성
  React.useEffect(() => {
    if (responses.length === 5 && inputCount === 5 && !imageLoading) {
      const combinedStory = responses
        .slice(0, 5)
        .map(response => response.story)
        .join(" ")
        .replace(/\n{2,}/g, " ")
        .replace(/\d+\.\s?/g, "")
        .replace(/(\d+)(?=\.)/g, "");

      generateImage(combinedStory);
    }
  }, [inputCount, responses, imageLoading, generateImage]);

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
          className="bg-custom-purple text-white w-10 h-10 rounded-full hover:bg-custom-violet 
                   transition-colors flex items-center justify-center shadow-2xl"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <GameStageIndicator currentStage={currentStage} maxStages={stages.length} />
        <button
          onClick={() => {
            if (window.confirm("정말 나가시겠습니까?")) {
              navigate("/game-intro", { state: { genre, tags, image } });
            }
          }}
          className="bg-custom-purple text-white w-10 h-10 rounded-full hover:bg-custom-violet 
                   transition-colors flex items-center justify-center shadow-2xl"
        >
          <ArrowBigLeftDash />
        </button>
      </div>
  
      {/* 게임 콘텐츠 컨테이너 */}
      <div className="absolute inset-0 flex flex-col items-center justify-between pt-20 pb-8 px-4">
        {/* 중앙 선택지 영역 */}
        <div className="flex-1 w-full max-w-2xl flex items-center justify-center min-h-[50vh]">
          {showChoices && (
            <div className="w-full space-y-5">
              {gameState.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="w-full bg-custom-purple bg-opacity-85 text-white py-4 px-6 
                           rounded-lg hover:bg-custom-violet shadow-2xl
                           transition-colors duration-200 text-left"
                >
                  {choice.id}. {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
  
        {/* 하단 메시지 영역 */}
        <div className="w-full max-w-2xl">
          {/* 메시지 창 */}
          <div className="bg-custom-purple bg-opacity-90 rounded-lg p-6 mb-6 shadow-2xl">
            <div className="text-base leading-relaxed">
              {gameState.mainMessage}
            </div>
          </div>
  
          {/* 스테이지 네비게이션 버튼들 */}
          {!showChoices && (
            <div className="flex justify-between mt-4">
              <button
                onClick={
                  currentStage < stages.length - 1
                    ? goToNextStage
                    : () => navigate("/game-ending")
                }
                className="text-white font-bold py-2 px-6
                         bg-custom-purple bg-opacity-85 rounded-full 
                         hover:bg-custom-violet transition-colors
                         ml-auto shadow-2xl"
              >
                {currentStage < stages.length - 1 ? "Next" : "Game"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;