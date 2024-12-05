import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import { useDarkMode } from "../Contexts/DarkModeContext";

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedGenre, setSelectedGenre] = useState("생존");

  const genreImages: { [key: string]: string[] } = {
    생존: [
      "images/game-start.webp",
      "images/game-start.webp",
      "images/game-start.webp",
      "images/game-start.webp",
    ],
    추리: [

    ],
    연애: [

    ],
    성장: [

    ],
  };

  const [cookies, setCookie, removeCookie] = useCookies(["id"]);

  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("cookies.id", cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }

    if (!checkAuth(cookies.id)) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto pt-4 bg-white text-gray-800 p-2 min-h-screen dark:bg-custom-background">
      <div className="w-full mx-auto mt-20">
        <div
          className="w-full p-4 mb-9 flex justify-around items-center"
          style={{ borderRadius: "50px", height: "50px" }}
        >
          {Object.keys(genreImages).map((genre) => (
            <button
              key={genre}
              className={`px-4 py-2 w-1/4 text-center rounded-full 
                ${
                  genre === "생존"
                    ? "hover:bg-custom-violet hover:text-white"
                    : "cursor-not-allowed opacity-50"
                } 
                ${
                  selectedGenre === genre
                    ? "bg-custom-violet text-white"
                    : "dark:text-white"
                }`}
              style={{ borderRadius: "50px" }}
              onClick={() => genre === "생존" && setSelectedGenre(genre)}
              disabled={genre !== "생존"}
            >
              {genre}
            </button>
          ))}
        </div>

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
