import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingLottie from "./Animation.json";
import backLottie from "./Animation3.json";

const Main: React.FC = () => {
  const [showLoadingLottie, setShowLoadingLottie] = useState(false);

  const handleComplete = () => {
    // 첫 번째 애니메이션이 끝나자마자 상태 변경
    setShowLoadingLottie(true);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-between bg-black">
      <main className={`flex-grow w-full h-full max-w-lg overflow-hidden relative ${showLoadingLottie ? "bg-custom-violet" : "bg-black"}`}>

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
              src="/images/NARRATIVA.png"
              alt="Header Image"
              className="w-auto h-[80px]"
            />
          </div>
        )}

        {/* 아래쪽 애니메이션 섹션 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center justify-center w-full mt-10">
            <Lottie
              animationData={loadingLottie}
              className="w-64"
            />
          </div>
        )}

        {/* START 버튼 섹션 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center mt-10">
            <Link to="/login">
              <button className="flex items-center justify-center w-40 h-12 font-custom-font text-white bg-custom-violet rounded">
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

