import React from 'react';
import { getKakaoLoginLink } from '../api/kakaoApi';
import { getGoogleLoginLink } from '../api/googleApi';
import { getGithubLoginLink } from '../api/githubApi';

const Login: React.FC = () => {
  const kakaoLoginLink = getKakaoLoginLink();
  const googleLoginLink = getGoogleLoginLink();
  const githubLoginLink = getGithubLoginLink();

  // 버튼 클릭 시 kakaoLoginLink로 리디렉션
  const handleKakaoLoginClick = () => {
    window.location.href = kakaoLoginLink; // 카카오 로그인 페이지로 리디렉션
  };

  const handleGoogleLoginClick = () => {
    window.location.href = googleLoginLink; // 카카오 로그인 페이지로 리디렉션
  };

  const handleGithuboginClick = () => {
    window.location.href = githubLoginLink; // 카카오 로그인 페이지로 리디렉션
  };

  return (
        <div className="w-full max-w-xs space-y-4">
            <button className="w-60 py-3 text-yellow-800 bg-custom-yellow rounded-md flex justify-center items-center hover:bg-yellow-400"
            onClick={handleKakaoLoginClick}
            >
              <img src="/images/kakao.png" alt="Kakao Icon" className="w-5 h-5 mr-2" />
              <span>Login with Kakao</span>
            </button>
            <button className="w-60 py-3 text-black bg-white border-black border rounded-md flex justify-center items-center hover:bg-gray-200"
            onClick={handleGoogleLoginClick}
            >
              <img src="/images/google_icon.png" alt="Google Icon" className="w-5 h-5 mr-2" />
              <span>Login with Google</span>
            </button>
            <button className="w-full py-3 text-white bg-black rounded-md flex justify-center items-center hover:bg-gray-700"
            onClick={handleGithuboginClick}
            >
              <img src="/images/github-mark-white.png" alt="GitHub Icon" className="w-5 h-5 mr-2" />
              <span>Login with GitHub</span>
            </button>
        </div>

);
};

export default Login;
