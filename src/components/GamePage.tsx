import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import axios from "../api/axiosInstance";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
  userInput: string;
  initialStory: string;
  previousUserInput: string;
}

interface Message {
  sender: "user" | "opponent";
  text: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory, previousUserInput } =
    location.state as LocationState;

  const [allMessages, setAllMessages] = useState<{ [key: number]: Message[] }>(
    {}
  );

  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // 사용자 입력
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [isExpanded, setIsExpanded] = useState(false); // 채팅창 확장 상태
  const [currentStage, setCurrentStage] = useState<number>(0); // 현재 스테이지
  const [musicUrl, setMusicUrl] = useState<string | null>(null); // 음악 URL
  const [musicLoading, setMusicLoading] = useState<boolean>(false); // 음악 로딩 상태
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // 음악 재생 상태
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // 메시지의 끝을 가리킬 ref
  const [cookies, setCookie, removeCookie] = useCookies(["id"]); // 쿠키

  const [inputCount, setInputCount] = useState<number>(0); // 입력 횟수 카운트

  const stages = [
    { bg: image || "/images/game-start.jpeg", content: "Welcome to Stage!" },
    { bg: "/images/stage10.jpeg", content: "Final Stage! Stage 1!" },
    { bg: "/images/stage1.jpeg", content: "You're now in Stage 2!" },
    { bg: "/images/stage2.jpeg", content: "Keep going! Stage 3!" },
    { bg: "/images/stage3.jpeg", content: "Almost there! Stage 4!" },
    { bg: "/images/stage4.jpeg", content: "Final Stage! Stage 5!" },
    { bg: "/images/stage5.jpeg", content: "Final Stage! Stage 6!" },
    { bg: "/images/stage6.jpeg", content: "Final Stage! Stage 7!" },
    { bg: "/images/stage7.jpeg", content: "Final Stage! Stage 8!" },
    { bg: "/images/stage8.jpeg", content: "Final Stage! Stage 9!" },
    { bg: "/images/stage9.jpeg", content: "Final Stage! Stage 10!" },
  ];

  // 음악 API 호출
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
      setMusicUrl(data.url); // API에서 가져온 음악 URL 설정
    } catch (error) {
      console.error("Error fetching music URL:", error);
      setMusicUrl(null); // 음악 URL 초기화
    } finally {
      setMusicLoading(false);
    }
  };

  // 채팅창 확장/축소 토글
  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  // 사용자 메시지 전송 및 API 호출
  const handleSendMessage = async () => {
    if (userInput.trim() === "" || loading) return;

    const newMessage: Message = { sender: "user", text: userInput };
    setCurrentMessages((prev) => [...prev, newMessage]);
    setAllMessages((prev) => ({
      ...prev,
      [currentStage]: [...(prev[currentStage] || []), newMessage],
    }));

    setUserInput(""); // 입력 초기화
    setInputCount((prev) => prev + 1); // 입력 횟수 증가

    if (inputCount + 1 >= 6) {
      // 5번 입력 후 다음 스테이지로 이동
      setTimeout(() => goToNextStage(), 10000); // 10초 후 이동
    } else {
      // 백엔드 호출
      await fetchOpponentMessage(userInput);
    }
  };

  const fetchOpponentMessage = async (userInput: string) => {
    setLoading(true);
    try {
      const requestBody = {
        genre: genre || "", // 선택한 장르
        currentStage, // 현재 스테이지 값
        initialStory, // FastAPI에서 생성된 초기 스토리
        userInput, // 유저가 입력한 값
        previousUserInput: previousUserInput || "", // 이전 입력값 (없으면 빈 문자열)
      };
      // console.log("Request Body:", requestBody); // 데이터 확인용

      const response = await axios.post("/generate-story/chat", requestBody);

      if (response.data && response.data.story) {
        const newMessage: Message = {
          sender: "opponent",
          text: response.data.story,
        };

        setCurrentMessages((prev) => [...prev, newMessage]); // 현재 메시지 업데이트
        setAllMessages((prev) => ({
          ...prev,
          [currentStage]: [...(prev[currentStage] || []), newMessage], // 전체 메시지 업데이트
        }));
      }
    } catch (error: any) {
      console.error("Error fetching opponent message:", error);
      const errorMessage: Message = {
        sender: "opponent",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
      };

      setCurrentMessages((prev) => [...prev, errorMessage]); // 에러 메시지 추가
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] || []), errorMessage],
      }));
    } finally {
      setLoading(false);
    }
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
      // 현재 스테이지에서 마지막 메시지를 다음 스테이지로 이동
      const newMessages = [...currentMessages]; // 현재 메시지 복사
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: newMessages, // 현재 단계의 메시지로 저장
      }));

      // 다음 스테이지로 이동하면서 메시지 전달
      setCurrentMessages(newMessages); // 현재 메시지 그대로 다음 스테이지로 설정
      setCurrentStage((prev) => prev + 1); // 단계 증가
      setInputCount(0); // 입력 횟수 초기화
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      const previousMessages = allMessages[currentStage - 1] || [];
      setCurrentMessages(previousMessages); // 이전 단계 메시지 설정
      setCurrentStage((prev) => prev - 1); // 단계 감소
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
    // initialStory가 있을 때만 처리
    if (initialStory && currentStage === 0) {
      // 초기 스토리가 있을 경우, 바로 메시지 추가
      const initialMessage: Message = {
        sender: "opponent",
        text: initialStory,
      };

      setCurrentMessages([initialMessage]); // 첫 번째 스테이지 메시지로 추가
      setAllMessages((prev) => ({
        ...prev,
        [0]: [initialMessage], // 첫 번째 단계의 메시지로 저장
      }));
    }
  }, [initialStory, currentStage]); // currentStage도 의존성에 추가하여 스테이지가 변경될 때마다 확인

  useEffect(() => {
    // 유저 정보 x '/' redirect
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }

    if (!checkAuth(cookies.id)) {
      navigate("/"); // 유저 상태코드 유효하지 않으면 접근
    }

    // 단계별 메시지 업데이트
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);

    // 새로운 단계의 음악 가져오기
    if (genre) {
      fetchMusic(genre);
    }
  }, [currentStage, genre, allMessages]);

  // 음악이 로드된 후 자동 재생
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      // 음악이 로드되었을 때 자동 재생 시도
      audioRef.current.play().catch((error) => {
        console.error("Auto-play was prevented:", error);
      });
      setIsPlaying(true); // 재생 상태 업데이트
    }
  }, [musicUrl]);

  // 채팅 메시지가 추가될 때마다 자동으로 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages]); // currentMessages가 변경될 때마다 실행

  return (
    <div className="relative w-full h-screen bg-gray-800 text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={stages[currentStage].bg}
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
          {/* 메시지 끝을 가리키는 요소 */}
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력창 */}
        {isExpanded && (
          <div className="p-4 bg-gray-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    handleSendMessage(); // 엔터키가 눌리면 메시지 전송
                  }
                }}
                className="border-2 border-gray-300 text-black rounded-l-lg py-2 px-3 w-full"
                placeholder="메시지를 입력하세요..."
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
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
              ? goToNextStage // 다음 단계로 이동
              : () => navigate("/game-ending") // 결말 페이지로 이동
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
