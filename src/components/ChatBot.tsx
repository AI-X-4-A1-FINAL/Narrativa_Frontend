import React, { useState, useEffect } from "react";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({ x: 50, y: 50 }); // 초기 위치
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "게임과 관련된 질문이나 도움을 요청해보세요!",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // 간단한 봇 응답 추가
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `제가 들은 건: "${input}"입니다.` },
      ]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)", // 가로 중앙 정렬
          bottom: "0", // 초이스 버튼 바로 아래로 이동
          marginBottom: "2rem", // 초이스 버튼과의 간격
          zIndex: 1000,
          cursor: "pointer", // 클릭 가능 상태 유지
        }}
        onMouseLeave={() => setIsDragging(false)} // 드래그 종료
        className="bg-custom-violet p-4 rounded-full shadow-lg"
        onClick={!isDragging ? toggleChatbot : undefined} // 드래그 중에는 클릭 무시
      >
        {/* 아이콘 이미지 */}
        <img
          src="/images/nati.webp" // public 폴더에 이미지 저장
          alt="Chatbot Icon"
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* 모달 창 */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 max-w-full flex flex-col h-96">
            <div className="flex justify-between items-center p-4 bg-custom-violet text-white rounded-t-lg">
              <h3 className="text-lg font-bold">Chatbot</h3>
              <button className="text-xl font-bold" onClick={toggleChatbot}>
                ✖️
              </button>
            </div>

            {/* 메시지 표시 */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === "user"
                      ? "text-right bg-blue-100"
                      : "text-left bg-gray-300"
                  } p-2 rounded-lg`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* 버튼 */}
            <div className="p-4 border-t bg-gray-50 flex">
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-custom-violet text-white rounded-md hover:bg-blue-600"
              >
                hint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
