import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import { useDarkMode } from "../Contexts/DarkModeContext";

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // 현재 선택된 장르를 관리하는 상태
  const [selectedGenre, setSelectedGenre] = useState("추리");

  // 각 장르에 대한 이미지 데이터
  const genreImages: { [key: string]: string[] } = {
    추리: [
      "images/game-start.jpeg",
      "images/game-start.jpeg",
      "images/game-start.jpeg",
      "images/game-start.jpeg",
    ],
    공포: [
      "images/horror1.png",
      "images/horror2.png",
      "images/horror3.png",
      "images/horror4.png",
    ],
    연애: [
      "images/romance1.png",
      "images/romance2.png",
      "images/romance3.png",
      "images/romance4.png",
    ],
    성장: [
      "images/growth1.png",
      "images/growth2.png",
      "images/growth3.png",
      "images/growth4.png",
    ],
  };

  // 쿠키 정보
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  // 데이터베이스에서 닉네임 가져오기
  useEffect(() => {
    console.log("cookies.id", cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }

    if (!checkAuth(cookies.id)) {
      navigate("/"); // 유저 상태코드 유효하지 않으면 접근
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto pt-4 bg-white text-gray-800 p-2 min-h-screen dark:bg-gray-900">
      <div className="w-full mx-auto mt-20">
        {/* Genre Selection Section */}
        <div
          className="w-full p-4 mb-9 flex justify-around items-center"
          style={{
            borderRadius: "50px",
            height: "50px",
          }}
        >
          {Object.keys(genreImages).map((genre) => (
            <button
              key={genre}
              className={`px-4 py-2 w-1/4 text-center rounded-full hover:bg-custom-violet hover:text-white ${
                selectedGenre === genre
                  ? "bg-custom-violet text-white"
                  : "dark:text-white "
              }`}
              style={{ borderRadius: "50px" }}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Image Grid Section */}
        <div className="grid grid-cols-2 gap-6">
          {genreImages[selectedGenre].map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`${selectedGenre} ${index + 1}`}
                className="w-full object-cover h-54"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
