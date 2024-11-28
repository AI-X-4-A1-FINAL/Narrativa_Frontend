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
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);
  const [inputCount, setInputCount] = useState<number>(0);
  const [bgImage, setBgImage] = useState<string>(
    image || "/images/game-start.jpeg"
  );
  const imageFetched = useRef(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const prevStageRef = useRef<number>(currentStage);

  const stages = [
    { content: "Welcome to Stage!" },
    { content: "Final Stage! Stage 1!" },
    { content: "You're now in Stage 2!" },
    { content: "Keep going! Stage 3!" },
    { content: "Almost there! Stage 4!" },
    { content: "Final Stage! Stage 5!" },
  ];

  // 이미지 받아오기
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

  // ML에서 이미지 받아오기
  const fetchBackgroundImageML = async (script: string) => {
    try {
      const apiUrl = "/api/images/generate-image";
      const requestBody = { script };
      const response = await axios.post(apiUrl, requestBody);
      const decodedString = atob(response.data);
      const parsedData = JSON.parse(decodedString);
      const imageURL = parsedData.imageUrl;
      setBgImage(imageURL);
    } catch (error: any) {
      console.error("Error in fetchBackgroundImageML:", error);
      setBgImage("/images/pikachu.jpg");
    }
  };

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

  const handleSendMessage = async () => {
    if (userInput.trim() === "" || loading || inputDisabled) {
      const newMessage: Message = {
        sender: "opponent",
        text: "답을 입력해주세요",
      };
      setCurrentMessages((prev) => [...prev, newMessage]);
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] || []), newMessage],
      }));
      return;
    }

    const userMessage: Message = { sender: "user", text: userInput };
    setCurrentMessages((prev) => [...prev, userMessage]);
    setAllMessages((prev) => ({
      ...prev,
      [currentStage]: [...(prev[currentStage] || []), userMessage],
    }));
    setUserInput("");
    setInputCount((prev) => prev + 1);

    if (inputCount + 1 >= 5) {
      setInputDisabled(true);
      const nextMessage: Message = {
        sender: "opponent",
        text: "다음 스테이지로 넘어가세요.",
      };
      setCurrentMessages((prev) => [...prev, nextMessage]);
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] || []), nextMessage],
      }));
      await fetchOpponentMessage(userInput);
    } else {
      await fetchOpponentMessage(userInput);
    }
  };

  const fetchOpponentMessage = async (userInput: string) => {
    setLoading(true);
    try {
      // 모든 대화 내용들을 리스트로 생성
      const conversationHistory =
        (allMessages[currentStage - 1] || []).length > 0
          ? (allMessages[currentStage - 1] || []).map(
              (msg: Message) => `${msg.sender}: ${msg.text}`
            )
          : [];

      // 요청 본문 작성
      const requestBody = {
        genre: genre || "",
        currentStage: currentStage > 0 ? currentStage : 1,
        initialStory: initialStory || "",
        userInput: userInput || "",
        previousUserInput: previousUserInput || "",
        conversationHistory: conversationHistory,
      };

      const response = await axios.post("/generate-story/chat", requestBody);

      // 응답 처리
      setResponses((prevResponses) => [...prevResponses, response.data]);

      if (response.data && response.data.story) {
        const newMessage: Message = {
          sender: "opponent",
          text: response.data.story,
        };
        setCurrentMessages((prev) => [...prev, newMessage]);
        setAllMessages((prev) => ({
          ...prev,
          [currentStage]: [...(prev[currentStage] || []), newMessage],
        }));
      }
    } catch (error: any) {
      console.error("Error in fetchOpponentMessage:", error); // 디버깅용 로그
      const errorMessage: Message = {
        sender: "opponent",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
      };

      setCurrentMessages((prev) => [...prev, errorMessage]);
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
      const newMessages = [...currentMessages];
      const lastMessage = newMessages[newMessages.length - 1];

      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: newMessages,
        [currentStage + 1]: [lastMessage],
      }));

      setCurrentMessages([lastMessage]);
      setCurrentStage((prev) => prev + 1);
      setInputCount(0);
      setInputDisabled(false);
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      const previousMessages = allMessages[currentStage - 1] || [];
      setCurrentMessages(previousMessages);
      setCurrentStage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);
  }, [currentStage, allMessages]);

  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (initialStory && currentStage === 0) {
      const initialMessage: Message = {
        sender: "opponent",
        text: initialStory,
      };
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [initialMessage],
      }));
      setCurrentMessages([initialMessage]);
    }

    fetchBackgroundImage();
    fetchMusic(genre);

    if (cookies.id) {
      checkAuth(parseInt(cookies.id));
    }

    if (inputCount > 5) {
      setInputDisabled(true);
    }
  }, [currentStage, cookies.id]);

  return (
    <div className="relative w-full h-screen bg-gray-800 text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage} // 동적으로 업데이트된 배경 이미지 사용
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
                disabled={inputDisabled} // 입력 비활성화
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || inputDisabled} // 버튼 비활성화
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
