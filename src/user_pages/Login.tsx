import React, { useEffect } from 'react';
import { getKakaoLoginLink } from '../api/kakaoApi';
import { getGoogleLoginLink } from '../api/googleApi';
import { getGithubLoginLink } from '../api/githubApi';

const Login: React.FC = () => {

  useEffect(() => {
    // 스크롤 비활성화
    document.body.style.overflow = 'hidden';

    // 컴포넌트 언마운트 시 원래 상태로 복원
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const photos = [
    { src: '/images/kakaotalk.png', alt: 'Kakao Login', onClick: getKakaoLoginLink },
    { src: '/images/google.png', alt: 'Google Login', onClick: getGoogleLoginLink },
    { src: '/images/git.png', alt: 'GitHub Login', onClick: getGithubLoginLink },
  ];

  return (
    <div className="flex flex-col items-center">
      <img src="/images/NARRATIVA_vi.png" alt="Login" className="h-20 mb-12 mt-32 " />
      
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => {
              const link = photo.onClick();
              window.location.href = link;
            }}
            className="mb-3 focus:outline-none flex justify-center w-full"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-72 h-auto object-contain rounded-md shadow-lg mx-auto"
            />
          </button>
        ))}
      
    </div>
  );
};

export default Login;
