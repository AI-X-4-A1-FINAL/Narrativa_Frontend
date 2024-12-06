import React, { useEffect } from "react";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import AuthGuard from "../api/accessControl";

const GameEnding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cookies, setCookie, removeCookie] = useCookies(["id"]); // 쿠키

  const { prompt, genre } = location.state || {};
  const image = location.state?.image || "/nara-thumbnail.png";

  const handleDownload = async () => {
    // 캡처할 영역과 다운로드 버튼 선택
    const captureArea = document.querySelector(".capture-area");
    const downloadButton = document.querySelector(".download-button");

    if (!captureArea) return;

    // 다운로드 버튼 숨기기
    if (downloadButton) {
      (downloadButton as HTMLElement).style.visibility = "hidden";
    }

    // html2canvas로 특정 영역 캡처
    const canvas = await html2canvas(captureArea as HTMLElement);

    // 숨긴 다운로드 버튼 복원
    if (downloadButton) {
      (downloadButton as HTMLElement).style.visibility = "visible";
    }

    // 캡처된 이미지를 JPG로 변환 및 다운로드
    const dataUrl = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "game-section.jpg";
    link.click();
  };

  // 유저 유효성 검증
  const checkAuth = async (userId: number): Promise<boolean> => {
    const isAuthenticated = await AuthGuard(userId);
    return isAuthenticated;
  };

  useEffect(() => {
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }

    if (!checkAuth(cookies.id)) {
      navigate("/");
    }
  }, []);

  // 홈으로
  const handleHome = () => {
    navigate("/home");
  };

  // 히스토리로
  const handleHistory = () => {
    navigate("/bookmarks");
  };

  return (
    <div className="h-full w-full flex flex-col justify-center">
      <div
        className="capture-area relative w-full text-black overflow-y-auto rounded-xl 
        shadow-lg shadow-gray-900/50 backdrop-blur-sm transition-all duration-300"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 다운로드 버튼 */}
        <button
          onClick={handleDownload}
          className="download-button absolute top-6 right-4 bg-gray-800/90 p-3 rounded-full 
          shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95 animate-bounce"
          title="Download Page"
        >
          <FaDownload size={20} className="text-gray-200 transition-colors" />
        </button>

        {/* 콘텐츠 */}
        <div className="min-h-[70dvh] max-h-[70dvh] flex flex-col justify-around items-center text-center p-8 gap-6">
          {/* 제목 */}
          <div
            className="w-4/5 flex flex-row justify-center text-center text-gray-100 bg-opacity-70
          bg-gray-900 rounded-xl border border-gray-600/50 shadow-xl p-5"
          >
            <p className="text-2xl font-bold tracking-wider">
              {genre || "Genre"} Summary
            </p>
          </div>

          {/* 설명 */}
          <div className="w-full flex-1 relative group">
            <div className="absolute inset-0 rounded-xl" />
            <p
              className="relative h-full min-h-[480px] max-h-[480px] text-gray-200 
              rounded-xl border border-gray-600/50 shadow-xl p-4 bg-gray-900 bg-opacity-70
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent 
              overflow-y-auto overflow-x-hidden"
              style={{
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              {prompt}
            </p>
          </div>
        </div>
      </div>

      <div className="my-4 flex flex-row justify-center items-center gap-8">
        <button
          className="px-8 py-4 relative overflow-hidden rounded-lg transition duration-300 focus:outline-none group"
          onClick={handleHome}
        >
          <p
            className="text-gray-700 dark:text-white text-lg font-bold tracking-wide relative z-10
          group-hover:scale-105 transition-transform duration-300"
          >
            HOME
          </p>
        </button>

        <span className="text-bold text-gray-700 opacity-80">|</span>

        <button
          className="px-8 py-4 relative overflow-hidden rounded-lg transition duration-300 group focus:outline-none"
          onClick={handleHistory}
        >
          <p
            className="text-gray-700 dark:text-white text-lg font-bold tracking-wide relative z-10
          group-hover:scale-105 transition-transform duration-300"
          >
            HISTORY
          </p>
        </button>
      </div>
    </div>
  );
};

export default GameEnding;
