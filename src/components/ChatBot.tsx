import React, { useState } from "react";

const ChatBot: React.FC = () => {
  const [isHintOpen, setIsHintOpen] = useState(false); // 힌트 창 상태
  const [hint, setHint] = useState<string | null>(null); // 출력할 힌트

  const toggleHintModal = () => {
    setIsHintOpen((prev) => !prev); // 버튼 클릭으로 모달 열기/닫기
    setHint(null); // 모달창이 닫힐 때 힌트를 초기화
  };

  const showHint = () => {
    setHint("이건 힌트입니다! 게임에 도움이 될 겁니다."); // 예시 힌트 메시지
  };

  return (
    <div>
      {/* 아이콘 버튼 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "100px",
          zIndex: 9999,
          cursor: "pointer",
        }}
        className="bg-custom-violet p-4 rounded-full shadow-lg"
        onClick={toggleHintModal} // 버튼 클릭으로 모달 토글
      >
        <img
          src="/images/nati.webp"
          alt="Chatbot Icon"
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* 힌트 모달창 */}
      {isHintOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 max-w-full flex flex-col h-96">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-4 bg-custom-violet text-white rounded-t-lg">
              <h3 className="text-lg font-bold">힌트</h3>
              {/* 닫기 버튼 */}
              <button className="text-xl font-bold" onClick={toggleHintModal}>
                ✖️
              </button>
            </div>

            {/* 힌트 내용 */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {hint ? (
                <p className="text-black">{hint}</p>
              ) : (
                <p className="text-gray-500">
                  힌트를 보려면 Hint 버튼을 클릭하세요!
                </p>
              )}
            </div>
            {/* Hint 버튼 */}
            <button
              onClick={showHint}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 shadow-md transition-colors"
            >
              생존률 확인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
