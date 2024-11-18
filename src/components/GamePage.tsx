import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
}

interface Message {
  sender: "user" | "opponent";
  text: string;
}

const Gaming: React.FC = () => {
  const location = useLocation();
  const {
    genre = "",
    tags = [],
    image = "",
  } = (location.state as LocationState) || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false); // 상태 추가

  // 출력창 열림/닫힘 토글
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // 상대방의 메시지를 불러오는 함수
  const fetchOpponentMessage = async (userInput: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${REACT_APP_SPRING_URI}/generate-story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genre,
          affection: 50, // 초기 호감도
          cut: 1, // 첫 번째 컷
          user_input: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.story) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "opponent", text: data.story },
        ]);
      }
    } catch (error) {
      console.error("Error fetching opponent message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "opponent", text: "오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 입력 처리
  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserInput(event.target.value);
  };

  // 메시지 전송 및 상대방 메시지 요청
  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput },
    ]);

    fetchOpponentMessage(userInput);
    setUserInput(""); // 입력 필드 초기화
  };

  // 초기 메시지 로드
  useEffect(() => {
    if (genre && image) {
      fetchOpponentMessage(""); // 첫 번째 메시지 요청
    }
  }, [genre, image]);

  return (
    <div className="relative h-screen bg-gray-800 text-white">
      {/* 메인 이미지 영역 */}
      <div
        className={`absolute top-0 w-full h-screen ${
          isExpanded ? "opacity-40" : "opacity-100"
        } transition-opacity duration-300`}
      >
        <img
          src="/images/game-start.jpeg"
          alt="Game Main"
          className="w-full h-full object-cover"
        />
        {isExpanded && (
          <div
            onClick={toggleExpansion} // 클릭 시 채팅창 축소
            className="absolute bottom-0 w-full h-full cursor-pointer"
          ></div>
        )}
      </div>

      {/* AI 출력창 */}
      <div
        onClick={!isExpanded ? toggleExpansion : undefined} // 확장 시 클릭 가능
        className={`absolute bottom-0 w-full bg-gray-900 text-white ${
          isExpanded ? "h-[80%] bg-opacity-80 backdrop-blur-sm" : "h-24"
        } transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* 출력창 헤더 */}
        <div className="flex justify-between items-center border-b pb-2 mb-2 p-4">
          <h2 className="text-lg font-semibold">
            {isExpanded ? "스토리" : "채팅창"}
          </h2>
        </div>

        {/* 출력 내용 / 채팅 */}
        <div
          className={`overflow-y-auto flex-grow px-4 space-y-2 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block px-3 py-1 rounded-lg ${
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

        {/* 입력창 및 보내기 버튼 */}
        {isExpanded && ( // isExpanded가 true일 때만 표시
          <div className="p-4 bg-gray-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInputChange}
                className="border-2 border-gray-300 text-black rounded-l-lg py-2 px-3 w-full"
                placeholder="메시지를 입력하세요..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-custom-purple text-white font-bold py-2 px-4 rounded-r-lg hover:bg-blue-600"
              >
                {loading ? "전송 중..." : "send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gaming;
