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
      <main className={`flex-grow w-full max-w-xl overflow-visible ${showLoadingLottie ? "bg-custom-violet" : "bg-black"}`}>

        {/* 첫 번째 애니메이션 */}
        {!showLoadingLottie && (
          <Lottie
            animationData={backLottie}
            onComplete={handleComplete} // 애니메이션이 끝나면 상태를 true로 변경
            loop={false}
            className="relative top-0 h-full"
          />
        )}

        {/* 위쪽 이미지 */}
        {showLoadingLottie && (
          <img
            src="/images/NARRATIVA.png"
            alt="Header Image"
            className="w-auto h-[90px] mt-40 ml-20 flex-col flex items-center justify-center"
          />
        )}

        {/* 아래쪽 Lottie 애니메이션 */}
        <div className="flex-col flex items-center justify-center w-full">
          {showLoadingLottie && (
            <Lottie
              animationData={loadingLottie}
              className="w-64 mt-12"
            />
          )}
        </div>

        {/* START 버튼 */}
        <Link to="/login">
          <button className="flex-col flex items-center justify-center w-full font-custom-font text-white rounded mt-24 hover:bg-color-white">
            START
          </button>
        </Link>

      </main>
    </div>
  );
};

export default Main;
