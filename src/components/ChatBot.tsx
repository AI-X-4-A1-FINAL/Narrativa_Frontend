import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import axios from "../api/axiosInstance";
import { Cookies } from "react-cookie";
import { parseCookieKeyValue } from "../api/cookie";

interface ChatBotProps {
  gameId?: string;
  position: "center" | "left";
  onToggle: () => void;
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
const ChatBot: React.FC<ChatBotProps> = ({ gameId, position, onToggle }) => {
  const [hint, setHint] = useState<string | null>(null);
  const [npcAdvice, setNpcAdvice] = useState<NPCAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [showingAnalysis, setShowingAnalysis] = useState(false);
  const [showingHint, setShowingHint] = useState(false);
  const [iconPosition, setIconPosition] = useState<"center" | "left">("center");

  // 토큰 가져오기
  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  const handleIconClick = async () => {
    if (!showingHint) {
      // 처음 클릭 시
      setShowingHint(true);
      // NPC 조언 가져오기
      await fetchHint();
      setTimeout(() => {
        setIconPosition("left");
        onToggle(); // 부모 컴포넌트에 알림
      }, 100);
    } else {
      // 다시 클릭 시
      setShowingHint(false);
      setShowingAnalysis(false);
      setCurrentChoiceIndex(0);
      setShowComment(false);
      setNpcAdvice(null);
      // 아이콘 위치를 중앙으로 복귀
      setIconPosition("center");
      onToggle();
    }
  };

  const fetchHint = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/npc/advice",
        { gameId: Number(gameId) },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          withCredentials: true
        }
      );
      setHint(response.data.npcMessage);
      setError(null);
    } catch (error) {
      setError("조언을 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysis = async () => {
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
      setNpcAdvice(response.data);
      setShowingAnalysis(true);
      setError(null);
    } catch (error) {
      setError("분석을 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getBestChoice = () => {
    if (!npcAdvice?.response) return null;
    
    return Object.entries(npcAdvice.response).reduce((best, current) => {
      return (best[1].survival_rate > current[1].survival_rate) ? best : current;
    });
  };

  const handleNext = () => {
    if (npcAdvice?.response) {
      const maxIndex = Object.keys(npcAdvice.response).length - 1;
      if (currentChoiceIndex < maxIndex) {
        setCurrentChoiceIndex(prev => prev + 1);
      } else if (currentChoiceIndex === maxIndex && !showComment) {
        setShowComment(true);
      }
    }
  };

  return (
    <>
      {/* 챗봇 아이콘 */}
      <div
        className={`fixed transform transition-all duration-1000 ease-in-out z-50 ${
          iconPosition === "center"
            ? "left-1/2 -translate-x-1/2 bottom-[50px]"
            : "left-95 bottom-[50px] translate-x-0"
        }`}
      >
        <button
          onClick={handleIconClick}
          className="bg-gray-800 bg-opacity-80 p-4 rounded-full shadow-lg hover:shadow-purple-500/50 
                    hover:scale-110 transition-all duration-300 ease-out border border-purple-500/30"
        >
          <div className="w-10 h-10 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-500 opacity-20 rounded-full animate-pulse"></div>
            <img
              src="/images/nati.webp"
              alt="Chatbot"
              className="w-8 h-8 object-contain relative z-10"
              style={{
                animation: "wiggle 2s infinite ease-in-out"
              }}
            />
          </div>
        </button>
      </div>
          
      {/* 말풍선 컨테이너 */}
      {position === "left" && (
        <div 
          className={`fixed left-1/2 -translate-x-1/2 bottom-[60px] w-80 transform transition-all duration-700 
                    ease-[cubic-bezier(0.34,1.56,0.64,1)] z-40 ${
            position === "left" 
              ? "translate-y-0 opacity-100 scale-100" 
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <div className="bg-gray-900 bg-opacity-90 rounded-lg shadow-2xl p-4 relative
                        border border-purple-500/30 backdrop-blur-sm
                        transition-all duration-500 ease-out
                        hover:shadow-purple-500/20">
            {/* 말풍선 꼬리 애니메이션 */}
            <div className="absolute -left-3 bottom-4 w-0 h-0 
                          border-t-[10px] border-t-transparent 
                          border-r-[16px] border-r-gray-900/90
                          border-b-[10px] border-b-transparent
                          transition-all duration-500 ease-out
                          transform origin-right" />

            <style>{`
              @keyframes wiggle {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
              }
            `}</style>
  
            {/* 컨텐츠 영역 */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
                </div>
              ) : error ? (
                <div className="text-red-400 p-2">{error}</div>
              ) : (
                <div className="space-y-4">
                  {/* NPC 조언 */}
                  {hint && !showingAnalysis && (
                    <div className="animate-fadeIn">
                      <p className="text-gray-200 mb-4 leading-relaxed">{hint}</p>
                      <button
                        onClick={handleAnalysis}
                        className="w-full bg-purple-600 bg-opacity-80 text-white py-2 px-4 rounded-lg
                                 hover:bg-purple-500 transition-colors border border-purple-400/30
                                 shadow-lg hover:shadow-purple-500/50"
                      >
                        생존률 분석하기
                      </button>
                    </div>
                  )}
  
                  {/* 선택지 분석 - 스타일 수정 */}
                  {showingAnalysis && npcAdvice && (
                    <div className="animate-fadeIn text-gray-200">
                      {/* 현재 선택지 분석 또는 마지막 단계의 최고 생존률 선택지 */}
                      {!showComment ? (
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <span className="mr-2">🎯</span>
                            <p className="leading-relaxed">
                              {Object.entries(npcAdvice.response)[currentChoiceIndex][1].advice}
                            </p>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>생존 가능성</span>
                              <span className="font-bold text-purple-300">
                                {Object.entries(npcAdvice.response)[currentChoiceIndex][1].survival_rate}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2 border border-purple-500/20">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-purple-600 to-purple-400"
                                style={{
                                  width: `${Object.entries(npcAdvice.response)[currentChoiceIndex][1].survival_rate}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // 최고 생존률 선택지와 추가 코멘트
                        <>
                          {/* 최고 생존률 선택지 */}
                          {getBestChoice() && (
                            <div className="space-y-3 mb-4">
                              <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                                <p className="text-gray-200 font-medium mb-2">최고 생존률 선택지:</p>
                                <div className="flex items-start">
                                  <span className="mr-2">⭐</span>
                                  <p className="leading-relaxed">
                                    {getBestChoice()?.[1].advice}
                                  </p>
                                </div>
                                <div className="mt-4">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span>생존 가능성</span>
                                    <span className="font-bold text-purple-300">
                                      {getBestChoice()?.[1].survival_rate}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-800 rounded-full h-2 border border-purple-500/20">
                                    <div
                                      className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-purple-600 to-purple-400"
                                      style={{
                                        width: `${getBestChoice()?.[1].survival_rate}%`
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 추가 코멘트 */}
                          {npcAdvice.additional_comment && (
                            <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30 animate-fadeIn">
                              <p className="text-gray-200">
                                <span className="mr-2">💡</span>
                                {npcAdvice.additional_comment}
                              </p>
                            </div>
                          )}
                        </>
                      )}
  
                      {/* 다음 버튼 */}
                      {!showComment && (
                        <button
                          onClick={handleNext}
                          className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded-lg 
                                   hover:bg-gray-700 transition-colors border border-purple-500/30
                                   flex items-center justify-center"
                        >
                          다음 <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;