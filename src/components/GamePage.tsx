import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";
import { LocationState } from "../utils/messageTypes";
import { ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useBackgroundImage } from "../hooks/useBackgroundImage";
import { useGameStage } from "../hooks/useGameStage";
import { useChatExpansion } from "../hooks/useChatExpansion";
import { useGameChat } from "../hooks/useGameChat";

const stages = [
  { content: "Welcome to Stage!" },
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

  // 인증
  const { userId, isAuthenticated } = useAuth();

  // 오디오
  const { isPlaying, togglePlayPause, initializeMusic } = useAudio();

  // 배경 이미지
  const { bgImage, isLoading: imageLoading, generateImage } = useBackgroundImage(image);

  // 게임 스테이지
  const { currentStage, goToNextStage, goToPreviousStage } = useGameStage({
    maxStages: stages.length,
    onStageChange: () => initializeMusic(genre),
  });

  // 채팅창 확장
  const { isExpanded, toggleExpansion } = useChatExpansion();

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
  }, [inputCount, responses, imageLoading]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gray-800 text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={`Stage ${currentStage + 1}`}
          className="w-screen h-screen object-cover"
        />
      </div>

      {/* 상단 컨트롤 */}
      <div className="absolute top-4 flex justify-between w-full px-4">
        <button
          onClick={togglePlayPause}
          className="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-custom-purple 
                   flex items-center justify-center"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button
          onClick={() => {
            if (window.confirm("정말 나가시겠습니까?")) {
              navigate("/game-intro", { state: { genre, tags, image } });
            }
          }}
          className="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-custom-purple 
                   flex items-center justify-center"
        >
          <ArrowBigLeftDash />
        </button>
      </div>

      {/* 채팅창 */}
      <div
        className={`absolute bottom-0 w-full bg-opacity-20 bg-custom-violet text-white 
                   ${isExpanded ? "h-[85%] bg-opacity-20 backdrop-blur-md" : "h-[20%]"}
                   transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div
          className="flex justify-between items-center border-b pb-4 p-4 cursor-pointer"
          onClick={toggleExpansion}
        >
          <h2 className="text-lg font-semibold">
            {isExpanded ? `스토리 진행 - 단계 ${currentStage + 1}` : "채팅창 열기"}
          </h2>
        </div>

        {isExpanded && (
          <>
            <div className="overflow-y-auto flex-grow px-4 space-y-2">
              {currentMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <p
                    className={`inline-block px-3 py-2 rounded-lg 
                             ${message.sender === "user" 
                               ? "bg-white text-black" 
                               : "bg-custom-purple text-white"}`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-900">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="border-2 border-gray-300 text-black rounded-l-lg py-2 px-3 w-full"
                  placeholder="메시지를 입력하세요..."
                  disabled={inputDisabled}
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading || inputDisabled}
                  className="bg-custom-violet text-white font-bold py-2 px-4 rounded-r-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 스테이지 네비게이션 버튼 */}
      {!isExpanded && (
        <>
          <button
            onClick={
              currentStage < stages.length - 1
                ? goToNextStage
                : () => navigate("/game-ending")
            }
            className="absolute right-4 bottom-4 text-white font-bold py-2 px-4 
                     rounded-full hover:bg-custom-violet"
          >
            {currentStage < stages.length - 1 ? "Next" : "Game"}
          </button>

          {currentStage > 0 && (
            <button
              onClick={goToPreviousStage}
              className="absolute left-4 bottom-4 text-white font-bold py-2 px-4 
                       rounded-full hover:bg-custom-violet"
            >
              Back
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default GamePage;