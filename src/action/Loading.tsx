import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingLottie from "../user_pages/Animation.json"; // 애니메이션 파일 경로
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";

const Loading: React.FC = () => {
  const navigate = useNavigate();
  const [showLoadingLottie, setShowLoadingLottie] = useState(true); // 기본값 true

  const [cookies, setCookie, removeCookie] = useCookies(['id']);  // 쿠키

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard (userId);
    if (!isAuthenticated) {
      navigate('/');
    }
  };
  
  useEffect(() => {
    console.log('cookies.id', cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate('/');
    };

    if (!checkAuth(cookies.id)) {
      navigate('/');  // 유저 상태코드 유효하지 않으면 접근
    }
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
