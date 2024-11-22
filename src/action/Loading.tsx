import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingLottie from "../user_pages/Animation.json"; // 애니메이션 파일 경로
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Loading: React.FC = () => {
  const [showLoadingLottie, setShowLoadingLottie] = useState(true); // 기본값 true

  const [cookies, setCookie, removeCookie] = useCookies(['id']);  // 쿠키
  const navigate = useNavigate(); // navigate 훅을 사용하여 리디렉션
  
  useEffect(() => {
    console.log('cookies.id', cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate('/');
    };
  }, []);

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
