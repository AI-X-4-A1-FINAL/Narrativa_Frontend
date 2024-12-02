// src/components/GamePage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import axios from "../api/axiosInstance";
import { useMessageManagement } from "../utils/useMessageManagement";
import { LocationState } from "../utils/messageTypes";

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory, userInput, previousUserInput } =
    location.state as LocationState;

  const [userInputState, setUserInputState] = useState<string>(userInput || "");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);
  const [bgImage, setBgImage] = useState<string>(
    image || "/images/game-start.jpeg"
  );
  const imageFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const prevStageRef = useRef<number>(currentStage);
  const {
    allMessages,
    currentMessages,
    inputCount,
    inputDisabled,
    loading,
    responses,
    handleSendMessage,
    setInputCount,
    setInputDisabled,
    messagesEndRef,
  } = useMessageManagement({
    genre,
    currentStage,
    initialStory,
    userInput: userInputState,
    previousUserInput,
    conversationHistory,
    tags,
    image,
  });

  const stages = [
    { content: "Welcome to Stage!" },
    { content: "Final Stage! Stage 1!" },
    { content: "You're now in Stage 2!" },
    { content: "Keep going! Stage 3!" },
    { content: "Almost there! Stage 4!" },
    { content: "Final Stage! Stage 5!" },
  ];

  // 배경 이미지 가져오기 함수
  const fetchBackgroundImage = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/images/random`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBgImage(data.imageUrl);
    } catch (error) {
      setBgImage("/images/pikachu.jpg");
    }
  };

  // ML에서 이미지 생성 함수
  const fetchBackgroundImageML = async (script: string) => {
    try {
      const apiUrl = "/api/images/generate-image";
      const requestBody = {
        prompt: script,
        size: "1024x1024",
        n: 1,
      };

      console.log(requestBody);

      const response = await axios.post(apiUrl, requestBody);
      console.log("Image generated successfully:", response.data);

      const imageURL = response.data;
      console.log("Image URL:", imageURL);

      setBgImage(imageURL);
    } catch (error) {
      console.error("Error in fetchBackgroundImageML:", error);
    }
  };

  // 음악 API 호출 함수
  const fetchMusic = async (stageGenre: string) => {
    setMusicLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/music/random?genre=${stageGenre}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMusicUrl(data.url);
    } catch (error) {
      setMusicUrl(null);
    } finally {
      setMusicLoading(false);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goToNextStage = () => {
    if (currentStage < stages.length - 1) {
      const newMessages = [...currentMessages];
      const lastMessage = newMessages[newMessages.length - 1];

      allMessages[currentStage] = newMessages;
      allMessages[currentStage + 1] = [lastMessage];

      setCurrentStage((prev) => prev + 1);
      setInputCount(0);
      setInputDisabled(false);
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      const previousMessages = allMessages[currentStage - 1] || [];
      setCurrentStage((prev) => prev - 1);
    }
  };

  const sendMessage = async () => {
    const newCount = await handleSendMessage(userInputState, currentStage);
    if (newCount !== undefined) {
      setUserInputState("");
    }
  };

  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  // 이미지 가져오기 useEffect
  useEffect(() => {
    if (!imageFetched.current) {
      fetchBackgroundImage();
      imageFetched.current = true;
    }
  }, []);

  // 채팅 5번 입력 후 배경 이미지를 새로 가져오기 위한 useEffect
  useEffect(() => {
    if (responses.length === 5 && inputCount === 5 && !isLoading) {
      // 각 story의 내용을 결합하고 불필요한 \n\n을 제거
      const combinedStory = responses
        .slice(0, 5)
        .map((response) => response.story) // 각 story 추출
        .join(" ") // 공백을 기준으로 합침
        .replace(/\n{2,}/g, " ") // \n\n 이상인 부분을 공백으로 대체
        .replace(/\d+\.\s?/g, "") // 숫자와 선택지 번호 제거 (예: "1. ", "2. ")
        .replace(/(\d+)(?=\.)/g, ""); // 선택지 번호 뒤의 숫자도 제거

      const script = JSON.stringify({ story: combinedStory }, null, 2);
      console.log(script);

      // 로딩 상태 업데이트
      setIsLoading(true); // 요청 시작

      // 배경 이미지 처리 함수 호출
      fetchBackgroundImageML(script)
        .then(() => {
          // 요청이 완료된 후 inputCount 초기화
          setInputCount(0);
        })
        .finally(() => {
          setIsLoading(false); // 요청이 완료되었으므로 로딩 상태 해제
        });
    }
  }, [inputCount, responses, isLoading]); // inputCount나 responses가 변경될 때마다 실행

  // 인증 및 음악 관련 useEffect
  useEffect(() => {
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }
    if (!checkAuth(cookies.id)) {
      navigate("/");
    }

    if (genre && currentStage === 0 && !musicUrl) {
      fetchMusic(genre);
    }

    if (
      genre &&
      currentStage > prevStageRef.current &&
      currentStage < stages.length
    ) {
      fetchMusic(genre);
    }

    prevStageRef.current = currentStage;
  }, [currentStage, genre, cookies.id]);

  // 음악 자동 재생 useEffect
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch((error) => {
        console.error("Auto-play was prevented:", error);
      });
      setIsPlaying(true);
    }
  }, [musicUrl]);

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

      {/* 음악 플레이어 */}
      <div className="absolute top-0 left-4">
        {musicLoading ? (
          <p className="text-white">Loading music...</p>
        ) : musicUrl ? (
          <div className="flex flex-col items-center">
            <audio ref={audioRef} src={musicUrl} />
            <button
              onClick={togglePlayPause}
              className="bg-gray-900 text-white font-bold py-2 px-4 mt-4 rounded-full hover:bg-custom-purple"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        ) : (
          <p className="text-white">No music available</p>
        )}
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="absolute top-0 right-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              if (window.confirm("정말 나가시겠습니까?")) {
                navigate("/game-intro", {
                  state: {
                    genre,
                    tags,
                    image,
                  },
                });
              }
            }}
            className="bg-gray-900 text-white font-bold py-2 px-4 mt-4 rounded-full hover:bg-custom-purple"
          >
            ↻
          </button>
        </div>
      </div>

      {/* 채팅창 */}
      <div
        className={`absolute bottom-0 w-full bg-opacity-20 bg-custom-violet text-white ${
          isExpanded ? "h-[85%] bg-opacity-20 backdrop-blur-md" : "h-[20%]"
        } transition-all duration-300 ease-in-out flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-between items-center border-b pb-4 p-4 cursor-pointer"
          onClick={toggleExpansion}
        >
          <h2 className="text-lg font-semibold">
            {isExpanded
              ? `스토리 진행 - 단계 ${currentStage + 1}`
              : "채팅창 열기"}
          </h2>
        </div>

        {/* 채팅 메시지 */}
        <div
          className={`overflow-y-auto flex-grow px-4 space-y-2 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          {currentMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block px-3 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-white text-black"
                    : "bg-custom-purple text-white"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력창 */}
        {isExpanded && (
          <div className="p-4 bg-gray-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInputState(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    sendMessage();
                  }
                }}
                className="border-2 border-gray-300 text-black rounded-l-lg py-2 px-3 w-full"
                placeholder="메시지를 입력하세요..."
                disabled={inputDisabled}
              />
              <button
                onClick={sendMessage}
                disabled={loading || inputDisabled}
                className={`bg-custom-violet text-white font-bold py-2 px-4 rounded-r-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next 버튼 */}
      {!isExpanded && (
        <button
          onClick={
            currentStage < stages.length - 1
              ? goToNextStage
              : () => navigate("/game-ending")
          }
          className="absolute right-4 bottom-4 text-white font-bold py-2 px-4 rounded-full hover:bg-custom-violet"
        >
          {currentStage < stages.length - 1 ? "Next" : "Game"}
        </button>
      )}

      {/* Back 버튼 */}
      {!isExpanded && currentStage > 0 && (
        <button
          onClick={goToPreviousStage}
          className="absolute left-4 bottom-4  text-white font-bold py-2 px-4 rounded-full hover:bg-custom-violet"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default GamePage;
