import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import AuthGuard from "../api/accessControl";
import ScrollIndicator from "../components/ScrollIndicator";
import { parseCookieKeyValue } from "../api/cookie";

import { trackEvent } from '../utils/analytics';

interface Genre {
  name: string;
  tags: string[];
  image: string;
  available: boolean;
}

interface UserInfo {
  access_token: string;
  user_id: number;
  profile_url: string;
  loginType: string;
  id: number;
  username: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const Home: React.FC = () => {
  useEffect(() => {
    // 홈 페이지 방문 추적
    trackEvent.pageView('home');
  }, []);
  
  const navigate = useNavigate();

  // 쿠키 이름 배열을 전달하여 쿠키 값을 가져옵니다.
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);

  // 회원 상태
  const [userState, setUserState] = useState<string | null>(null);

  // 유저 유효성 검증
  const checkAuth = async (userId: number, accessToken: string) => {
    const isAuthenticated = await AuthGuard(userId, accessToken);
    // console.log('isAuthenticated: ', isAuthenticated);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    const cookieToken = cookie.token;
    // console.log('cookie: ', cookie);

    cookieToken == null && navigate("/"); // cookieToken이 null일 때만 navigate("/")가 실행

    const _cookieContent = parseCookieKeyValue(cookieToken);
    
    if (_cookieContent == null) {
      navigate("/");
    } else {
      const userInfo: UserInfo = {
        access_token: _cookieContent.access_token || '',
        user_id: _cookieContent.user_id || 0,
        profile_url: _cookieContent.profile_url || '',
        loginType: _cookieContent.loginType || '',
        id: _cookieContent.id || 0,
        username: _cookieContent.username || '',
      };

    }
  }, [cookie, navigate]);

  // 장르 데이터 배열
  const genres: Genre[] = [
    {
      name: "Survival",
      tags: ["서바이벌", "살아남기"],
      image: "/images/survival.webp",
      available: true,
    },
    {
      name: "Romance",
      tags: ["사랑", "드라마"],
      image: "/images/romance.webp",
      available: false,
    },
    {
      name: "Simulation",
      tags: ["시뮬레이션", "라이프"],
      image: "/images/simulation.webp",
      available: false,
    },
    {
      name: "Mystery",
      tags: ["스릴러", "범죄"],
      image: "/images/detective.webp",
      available: false,
    },
  ];

  // 장르 클릭 핸들러
  const handleClick = (
    genre: string,
    tags: string[],
    image: string,
    available: boolean
  ) => {
    if (!available) return;

    // Google Analytics 게임 시작 이벤트 추적
    window.dataLayer.push({
      'event': 'game_start',
      'game_name': genre,
      'game_tags': tags.join(',')
    });

    navigate("/game-intro", {
      state: {
        genre,
        tags,
        image,
      },
    });
  };

  return (
    <div className="w-full text-black min-h-screen overflow-y-auto bg-white mt-2">
      <div className="flex flex-col items-center dark:bg-custom-background dark:text-white">
        {genres.map((genre) => (
          <div
            key={genre.name}
            className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-gray-50 shadow-lg mb-6 group"
          >
            <div
              className={`relative ${
                genre.available ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onClick={() =>
                handleClick(
                  genre.name,
                  genre.tags,
                  genre.image,
                  genre.available
                )
              }
            >
              <img
                src={genre.image}
                alt={`${genre.name} Genre Cover`}
                className={`w-full h-[400px] object-cover rounded-2xl ${
                  !genre.available && "opacity-50"
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-center p-4 opacity-100 group-hover:opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                <div>
                  <h3 className="text-2xl font-bold">{genre.name}</h3>
                  <div className="mt-2">
                    {genre.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-sm font-semibold mr-2 px-2 py-1 rounded-full bg-gray-800 bg-opacity-60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {!genre.available && (
                    <div className="mt-2 text-2xl font-bold text-orange-400">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default Home;
