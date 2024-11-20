import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  // 채팅창 확장/축소 토글
  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  // 사용자 메시지 전송 및 API 호출
  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    // 새 메시지 생성 (타입 명시)
    const newMessage: Message = { sender: "user", text: userInput };

    // 현재 단계 메시지 업데이트
    setCurrentMessages((prev: Message[]) => [...prev, newMessage]);

    // 모든 단계 메시지 상태 업데이트
    setAllMessages((prev: { [key: number]: Message[] }) => {
      const stageMessages: Message[] = prev[currentStage] || []; // 현재 단계의 메시지 배열 초기화
      return {
        ...prev,
        [currentStage]: [...stageMessages, newMessage], // 새 메시지 추가
      };
    });

    // API 호출
    fetchOpponentMessage(userInput);

    setUserInput(""); // 입력 필드 초기화
  };

  // 상대방 메시지 비동기 가져오기
  const fetchOpponentMessage = async (userInput: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/generate-story`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genre,
            affection: 50,
            cut: currentStage + 1, // 현재 단계에 맞게 API 요청
            user_input: userInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.story) {
        const opponentMessage = { sender: "opponent", text: data.story };
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

  // 단계 이동 시 메시지 유지
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
  const goToEnding = () => {
    navigate("/game-ending");
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

  // 단계 변경 시 기존 메시지 로드
  useEffect(() => {
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);
  }, [currentStage]);

  return (
    <div className="relative w-full h-screen bg-gray-800 text-white">
      {/* 배경 이미지 */}
      <div
        className={`absolute inset-0 ${
          isExpanded ? "opacity-40" : "opacity-100"
        } transition-opacity duration-300 max-w-lg`}
        onClick={() => {
          if (isExpanded) toggleExpansion();
        }}
        
      >
        <img
          src={stages[currentStage].bg}
          alt={`Stage ${currentStage + 1}`}
          className="w-screen h-screen object-cover" // Image stretches to full screen and covers the area
        />
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
          <h2 className="text-lg font-semibold " >
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
