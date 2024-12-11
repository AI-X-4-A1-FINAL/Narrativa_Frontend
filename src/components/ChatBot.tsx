import React, { useState } from "react";
import axios from "../api/axiosInstance"; // Axios 인스턴스 설정 필요

const ChatBot: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [isHintOpen, setIsHintOpen] = useState(false); // 힌트 창 상태
  const [npcResponse, setNpcResponse] = useState<any>(null); // NPC 조언 데이터
  const [error, setError] = useState<string | null>(null); // 에러 상태

  const toggleHintModal = () => {
    setIsHintOpen((prev) => !prev); // 버튼 클릭으로 모달 열기/닫기
    setNpcResponse(null); // 모달 초기화
    setError(null); // 에러 초기화
  };

  const fetchNpcAdvice = async () => {
    try {
      setError(null); // 이전 에러 초기화
      const response = await axios.post(`/npc/advice`, { game_id: gameId });
      setNpcResponse(response.data); // NPC 조언 데이터 저장
    } catch (err) {
      console.error("Error fetching NPC advice:", err);
      setError("NPC 조언을 가져오는 중 오류가 발생했습니다.");
    }
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

            {/* NPC 데이터 */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : npcResponse ? (
                <div>
                  <h4 className="font-bold">NPC 조언:</h4>
                  {Object.keys(npcResponse.response).map((key, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-gray-700">
                        <strong>{`선택지 ${key}: `}</strong>
                        {npcResponse.response[key].advice}
                      </p>
                      <p className="text-sm text-gray-500">
                        생존율: {npcResponse.response[key].survival_rate}%
                      </p>
                    </div>
                  ))}
                  <h5 className="mt-4 text-gray-600">
                    추가 코멘트: {npcResponse.additionalComment}
                  </h5>
                </div>
              ) : (
                <p className="text-gray-500">
                  힌트를 보려면 Hint 버튼을 클릭하세요!
                </p>
              )}
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={fetchNpcAdvice} // NPC 조언 요청
                className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
              >
                Hint
              </button>
              <button
                onClick={toggleHintModal}
                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
