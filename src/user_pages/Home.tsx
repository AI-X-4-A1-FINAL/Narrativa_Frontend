import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import AuthGuard from "../api/accessControl";

interface Genre {
  name: string;
  tags: string[];
  image: string;
  available: boolean;
}

interface UserInfo {
  nickname: string;
  status: string;
  profile_url: boolean;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 쿠키 이름 배열을 전달하여 쿠키 값을 가져옵니다.
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  // 회원 상태
  const [userState, setUserState] = useState<string | null>(null);

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    } else if (cookies.id) {
      setCookieValue(cookies.id);
    } else {
      setCookieValue(null);
    }

    if (!checkAuth(cookies.id)) {
      navigate("/");
    }

    if (cookies.id) {
      setCookieValue(cookies.id);
    } else {
      setCookieValue(null);
    }
  }, [cookies, navigate]);

  // 장르 데이터 배열
  const genres: Genre[] = [
    {
      name: "Survival",
      tags: ["서바이벌", "살아남기"],
      image: "/images/survival.jpeg",
      available: true,
    },
    {
      name: "Romance",
      tags: ["사랑", "드라마"],
      image: "/images/romance.png",
      available: false,
    },
    {
      name: "Simulation",
      tags: ["시뮬레이션", "라이프"],
      image: "/images/simulation.png",
      available: false,
    },
    {
      name: "Mystery",
      tags: ["스릴러", "범죄"],
      image: "/images/detective.jpg",
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
      <div className="flex flex-col items-center dark:bg-gray-900 dark:text-white">
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
    </div>
  );
};

export default Home;
