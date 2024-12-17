import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import AuthGuard from "../api/accessControl";
import ScrollIndicator from "../components/ScrollIndicator";
import { parseCookieKeyValue } from "../api/cookie";
import { statisticsService } from "../service/statisticsService";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";
import { useBGM } from "../Contexts/BGMContext";

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
  const navigate = useNavigate();
  const [cookie] = useCookies(["token"]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);
  const isModalDisplayed = useRef(false);

  useEffect(() => {
    const cookieToken = cookie.token;

    if (!cookieToken) {
      console.log("로그인 토큰이 없습니다. 로그인 페이지로 리다이렉트합니다.");
      navigate("/");
      return;
    }

    const _cookieContent = parseCookieKeyValue(cookieToken);
    if (!_cookieContent) {
      console.log("토큰 파싱 실패. 로그인 페이지로 리다이렉트합니다.");
      navigate("/");
      return;
    }

    const userInfo = {
      access_token: _cookieContent.access_token || "",
      user_id: _cookieContent.user_id || 0,
      profile_url: _cookieContent.profile_url || "",
      loginType: _cookieContent.loginType || "",
      id: _cookieContent.id || 0,
      username: _cookieContent.username || "",
    };

    AuthGuard(userInfo.user_id, userInfo.access_token).then(
      (isAuthenticated) => {
        if (isAuthenticated) {
          console.log("로그인 인증 성공.");
          setIsAuthenticated(true);

          // 로컬 스토리지에서 모달 표시 여부 확인
          const hasSeenModal = localStorage.getItem("hasSeenModal");

          // 모달이 이미 표시되었는지 확인
          if (!isModalDisplayed.current) {
            setIsModalOpen(true); // 모달 표시
            isModalDisplayed.current = true; // 모달 상태 업데이트
            console.log("모달 표시 상태 업데이트 완료");
          }
        } else {
          console.log("로그인 인증 실패. 로그인 페이지로 리다이렉트합니다.");
          navigate("/");
        }
      }
    );
  }, [cookie, navigate]);

  // 모달 닫기
  const closeModal = () => {
    console.log("모달 닫기 실행");
    setIsModalOpen(false);
    playSound(1); // 효과음 재생
  };

  // Genre data
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
      available: true,
    },
    {
      name: "Simulation",
      tags: ["시뮬레이션", "라이프"],
      image: "/images/simulation.webp",
      available: true,
    },
    {
      name: "Mystery",
      tags: ["스릴러", "범죄"],
      image: "/images/detective.webp",
      available: false,
    },
  ];

  // Handle genre click
  const handleClick = (genre: Genre) => {
    if (!genre.available) return;

    window.dataLayer.push({
      event: "game_start",
      game_name: genre.name,
      game_tags: genre.tags.join(","),
    });

    playSound(0);
    navigate("/game-intro", {
      state: {
        genre: genre.name,
        tags: genre.tags,
        image: genre.image,
      },
    });
  };

  return (
    <div className="w-full text-black min-h-screen overflow-y-auto bg-white mt-2 font-yang">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-lg shadow-2xl border border-gray-700">
            {/* 외곽 테두리 빛나는 효과 */}
            <div className="absolute inset-0 rounded-lg border-2 border-opacity-50 border-purple-500 blur-lg"></div>

            {/* 모달 콘텐츠 */}
            <div className="relative z-10 text-center text-gray-300">
              <h2 className="text-2xl font-extrabold text-purple-300 mb-4 glow-text">
                🎮 환영합니다! 🎮
              </h2>
              <p className="mb-6 text-sm md:text-base tracking-wide">
                나라티바와 함께 나만의 이야기를 만들어봐요!
              </p>

              <button
                onClick={() => {
                  playSound(0);
                  closeModal();
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-md transform hover:scale-105 hover:shadow-purple-600 transition-transform duration-300"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Genre Cards */}
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
              onClick={() => handleClick(genre)}
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

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default Home;

