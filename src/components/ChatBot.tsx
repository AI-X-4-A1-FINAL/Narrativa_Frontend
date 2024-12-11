import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { Cookies } from "react-cookie";
import { parseCookieKeyValue } from "../api/cookie";  // 쿠키 파싱 유틸리티 import

interface ChatBotProps {
  gameId?: string;
}

interface ChoiceAdvice {
  advice: string;
  survival_rate: number;
}

interface NPCAdvice {
  response: {
    [key: string]: ChoiceAdvice;
  };
  game_id: string;
  additional_comment: string | null;
}

const ChatBot: React.FC<ChatBotProps> = ({ gameId }) => {
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [npcAdvice, setNpcAdvice] = useState<NPCAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvice, setShowAdvice] = useState(true);

  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  useEffect(() => {
    console.log("ChatBot received gameId:", gameId); // gameId 확인용 로그
  }, [gameId]);

    // 뒤로가기 처리
  const handleBack = () => {
    setShowAdvice(true);
    setNpcAdvice(null);
  };

  // 모달 닫기 처리
  const handleCloseModal = () => {
    setIsHintOpen(false);
    setShowAdvice(true); // 모달 닫을 때 초기 상태로 복귀
    setNpcAdvice(null);
  };

  const toggleHintModal = async () => {
    setIsHintOpen((prev: boolean) => !prev);
    setHint(null);

    if (!isHintOpen) {  // 모달을 열 때만 API 호출
      if (!gameId) {
        setError("게임 ID가 없습니다.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          "/npc/advice",
          { gameId: Number(gameId) },  // string을 number로 변환
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,  // Authorization 헤더 수정
            },
            withCredentials: true  // withCredentials 추가
          }
        );
        setHint(response.data.npcMessage);
        setError(null);
      } catch (error: any) {
        console.error("NPC 조언 요청 실패:", error);
        setError(error.response?.data?.message || "NPC 조언을 받아오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  const showHint = async () => {
    if (!gameId) {
      setError("게임 ID가 없습니다.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post<NPCAdvice>(
        "/npc/chat",
        { gameId: Number(gameId) },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          withCredentials: true
        }
      );
      
      console.log("NPC Response:", response.data); // 응답 데이터 확인
      setNpcAdvice(response.data);
      setError(null);
    } catch (error: any) {
      console.error("NPC 채팅 요청 실패:", error);
      setError(error.response?.data?.message || "생존률 정보를 받아오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };


  // ChatBot.tsx
  return (
    <div>
      {/* 아이콘 버튼 */}
      <div
        className="bg-custom-violet p-4 rounded-full shadow-lg absolute left-1/2 transform -translate-x-1/2 bottom-[100px] z-50 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out animate-bounce"
        onClick={toggleHintModal}
        title="NPC 조언 받기"
      >
        <img
          src="/images/nati.webp"
          alt="Chatbot Icon"
          className="w-10 h-10 object-contain"
        />
      </div>
  
      {/* 모달창 */}
      {isHintOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg w-96 max-w-full flex flex-col h-[32rem]">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-4 bg-custom-violet text-white rounded-t-lg">
              <div className="flex items-center">
                {!showAdvice && (
                  <button
                    onClick={handleBack}
                    className="mr-3 hover:text-gray-200 transition-colors"
                  >
                    ←
                  </button>
                )}
                <h3 className="text-lg font-bold flex items-center">
                  <span className="mr-2">🤖</span>
                  {showAdvice ? "NPC 조언" : "선택지 분석"}
                </h3>
              </div>
              <button 
                className="text-xl hover:text-gray-200 transition-colors"
                onClick={handleCloseModal}
              >
                ✖️
              </button>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-violet"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 p-4 rounded-lg text-red-600">
                  <p>{error}</p>
                </div>
              ) : showAdvice ? (
                // NPC 조언 화면
                <div className="bg-white p-4 rounded-lg shadow-sm animate-fadeIn">
                  <div className="flex items-start mb-2">
                    <span className="mr-2 text-lg">💭</span>
                    <p className="text-gray-800">{hint || "NPC의 조언을 기다리고 있습니다..."}</p>
                  </div>
                </div>
              ) : (
                // 선택지 분석 화면
                <div className="space-y-4 animate-fadeIn">
                  {npcAdvice && npcAdvice.response && (
                    <>
                      {Object.entries(npcAdvice.response).map(([key, value], index) => (
                        <div 
                          key={key} 
                          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <span className="mr-2 text-lg">🎯</span>
                              <p className="text-gray-800">{value.advice}</p>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center mb-1">
                                <span className="text-sm text-gray-600 mr-2">생존 가능성</span>
                                <span className="text-blue-600 font-bold">{value.survival_rate}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                                  style={{ 
                                    width: `${value.survival_rate}%`,
                                    backgroundColor: `rgb(${Math.round(255 * (1 - value.survival_rate/100))}, ${Math.round(255 * (value.survival_rate/100))}, 0)`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {npcAdvice.additional_comment && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 animate-fadeIn">
                          <div className="flex items-start">
                            <span className="mr-2 text-lg">💡</span>
                            <p className="text-gray-700">{npcAdvice.additional_comment}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 하단 버튼 영역 */}
            {showAdvice && (
              <div className="p-4 bg-white border-t">
                <button
                  onClick={() => {
                    showHint();
                    setShowAdvice(false);
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center
                    ${loading 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-yellow-400 hover:bg-yellow-500 hover:transform hover:scale-105'}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      분석 중...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">🔍</span>
                      생존률 분석하기
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;