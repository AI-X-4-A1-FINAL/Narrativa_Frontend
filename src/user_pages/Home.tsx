import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import AuthGuard from "../api/accessControl";
import ScrollIndicator from "../components/ScrollIndicator";
import { parseCookieKeyValue } from "../api/cookie";
import { statisticsService } from "../service/statisticsService";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  // Fetch traffic statistics on mount
  useEffect(() => {
    statisticsService.incrementTraffic();
  }, []);

  // Handle authentication and display modal if first login
  useEffect(() => {
    const cookieToken = cookie.token;
    if (!cookieToken) {
      navigate("/");
      return;
    }

    const _cookieContent = parseCookieKeyValue(cookieToken);
    if (!_cookieContent) {
      navigate("/");
      return;
    }

    const userInfo: UserInfo = {
      access_token: _cookieContent.access_token || "",
      user_id: _cookieContent.user_id || 0,
      profile_url: _cookieContent.profile_url || "",
      loginType: _cookieContent.loginType || "",
      id: _cookieContent.id || 0,
      username: _cookieContent.username || "",
    };

    AuthGuard(userInfo.user_id, userInfo.access_token).then(
      (isAuthenticated) => {
        if (!isAuthenticated) {
          navigate("/");
          return;
        }

        // Check firstLoginShown flag safely
        const firstLoginShown = document.cookie
          .split("; ")
          .find((row) => row.startsWith("firstLoginShown="))
          ?.split("=")[1];

        if (!firstLoginShown) {
          setIsModalOpen(true);
          document.cookie = `firstLoginShown=true; path=/;`;
        }
      }
    );
  }, [cookie, navigate]);

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

  // Close modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mt-0 w-full text-black min-h-screen overflow-y-auto bg-white">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">환영합니다!</h2>
            <p className="mb-4">처음 로그인하셨습니다. 즐거운 시간 되세요!</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              닫기
            </button>
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
