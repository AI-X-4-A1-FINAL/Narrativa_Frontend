import React, { useState } from "react";
import Lottie from "lottie-react";
import loadingLottie from "../user_pages/Animation.json"; // 애니메이션 파일 경로

const Loading: React.FC = () => {
  const [showLoadingLottie, setShowLoadingLottie] = useState(true); // 기본값 true

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {showLoadingLottie && (
        <div className="flex flex-col items-center">
          {/* 애니메이션 */}
          <Lottie animationData={loadingLottie} className="w-64" />
          {/* 로딩 멘트 */}
          <p className="mt-4 text-lg text-gray-700">로딩중... 😢</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
