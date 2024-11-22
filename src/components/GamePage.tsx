import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
}

interface Message {
  sender: "user" | "opponent";
  text: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image } = (location.state as LocationState) || {};

  const [allMessages, setAllMessages] = useState<{ [key: number]: Message[] }>(
    {}
  ); // 단계별 대화 저장
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]); // 현재 단계 대화
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0); // 현재 스테이지
  const [musicUrl, setMusicUrl] = useState<string | null>(null); // 음악 URL 저장
  const [musicLoading, setMusicLoading] = useState<boolean>(false); // 음악 로딩 상태
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [cookies, setCookie, removeCookie] = useCookies(['id']);  // 쿠키

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
  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    const newMessage: Message = { sender: "user", text: userInput };
    setCurrentMessages((prev) => [...prev, newMessage]);
    setAllMessages((prev) => ({
      ...prev,
      [currentStage]: [...(prev[currentStage] || []), newMessage],
    }));

    fetchOpponentMessage(userInput);
    setUserInput("");
  };

  console.log(`${process.env.REACT_APP_SPRING_URI}/generate-story/start`);

  const fetchOpponentMessage = async (userInput: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/generate-story/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genre,
            affection: 50,
            cut: currentStage + 1,
            user_input: userInput,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.story) {
        setCurrentMessages((prev) => [
          ...prev,
          { sender: "opponent", text: data.story },
        ]);
      }
    } catch (error) {
      console.error("Error fetching opponent message:", error);
      setCurrentMessages((prev) => [
        ...prev,
        { sender: "opponent", text: "오류가 발생했습니다. 다시 시도해주세요." },
      ]);
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
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: currentMessages,
      }));
      const nextMessages = allMessages[currentStage + 1] || [];
      setCurrentMessages(nextMessages);
      setCurrentStage((prev) => prev + 1);
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: currentMessages,
      }));
      const previousMessages = allMessages[currentStage - 1] || [];
      setCurrentMessages(previousMessages);
      setCurrentStage((prev) => prev - 1);
    }
  };

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate('/');
    }
  };

  useEffect(() => {
    // 유저 정보 x '/' redirect
    console.log('cookies.id', cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate('/');
    }

    if (!checkAuth(cookies.id)) {
      navigate('/');  // 유저 상태코드 유효하지 않으면 접근
    }

    // 단계별 메시지 업데이트
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);

    // 새로운 단계의 음악 가져오기
    if (genre) {
      fetchMusic(genre);
    }
  }, [currentStage, genre]);

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
          <h2 className="text-lg font-semibold ">
            {isExpanded
              ? `스토리 진행 - 단계 ${currentStage + 1}`
              : "채팅창 열기"}
          </h2>
        </div>
        {currentStage === 0 && !isExpanded && (
          <div className="p-4">
            <p className="text-sm text-white">
              {stages[currentStage]?.content || "콘텐츠가 없습니다."}
            </p>
          </div>
        )}

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
                className="border-2 border-gray-300 text-black rounded-l-lg py-2 px-3 w-full"
                placeholder="메시지를 입력하세요..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-custom-violet text-white font-bold py-2 px-4 rounded-r-lg "
              >
                {loading ? "전송 중..." : "Send"}
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
