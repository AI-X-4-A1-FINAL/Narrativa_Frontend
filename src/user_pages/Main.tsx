import React, { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import loadingLottie from "./Animation2.json";
import backLottie from "./Animation3.json";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

const Main: React.FC = () => {
  const [showLoadingLottie, setShowLoadingLottie] = useState(false);
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  const handleComplete = () => {
    // 첫 번째 애니메이션이 끝나자마자 상태 변경
    setShowLoadingLottie(true);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-between bg-black">
      <main
        className={`flex-grow w-full h-full max-w-lg overflow-hidden relative ${
          showLoadingLottie ? "bg-custom-violet" : "bg-black"
        }`}
      >
        {/* 첫 번째 애니메이션 */}
        {!showLoadingLottie && (
          <Lottie
            animationData={backLottie}
            onComplete={handleComplete} // 애니메이션이 끝나면 상태를 true로 변경
            loop={false}
            className="relative inset-0 w-full h-full object-cover min-h-screen scale-[1.2]" // 모바일 대응
          />
        )}

        {/* 이미지 섹션 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center mt-40">
            <img
              src="/images/NARRATIVA.webp"
              alt="Header Image"
              className="w-auto h-[80px]"
            />
          </div>
        )}

        {/* 아래쪽 애니메이션 섹션 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center justify-center w-full mt-10 ml-5">
            <img src="/images/nati_1.gif" alt="NATI" className="w-auto h-64" />
          </div>
        )}

        {/* START 버튼 섹션 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center mt-10">
            <Link to="/login">
              <button
                onClick={() => playSound(0)}
                className="flex items-center justify-center font-custom-font text-white bg-custom-violet rounded"
              >
                START
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Main;
