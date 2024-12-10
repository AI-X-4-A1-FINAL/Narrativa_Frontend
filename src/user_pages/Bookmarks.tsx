import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import AuthGuard from "../api/accessControl";
import { useDarkMode } from "../Contexts/DarkModeContext";
import { parseCookieKeyValue } from "../api/cookie";

interface GameHistory {
  gameId: number;
  story: string;
  imageUrl: string;
  genre: string;
}

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedGenre, setSelectedGenre] = useState("생존");
  const [gameHistories, setGameHistories] = useState<GameHistory[]>([]); // 히스토리 데이터 상태
  const [cookie] = useCookies(["token"]);

  const fetchGameHistories = async (userId: number) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SPRING_URI}/generate-story/history`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${
              parseCookieKeyValue(cookie.token)?.access_token
            }`,
          },
          withCredentials: true,
        }
      );

      setGameHistories(response.data); // 서버 응답 데이터를 상태로 설정
    } catch (error) {
      console.error("Error fetching game histories:", error);
      // navigate("/");
    }
  };

  const checkAuth = async (userId: number, accessToken: string) => {
    const isAuthenticated = await AuthGuard(userId, accessToken);
    if (!isAuthenticated) {
      // navigate("/");
    }
  };

  useEffect(() => {
    const cookieToken = cookie.token;
    console.log("Raw cookie token:", cookieToken);

    const parsedToken = parseCookieKeyValue(cookieToken);
    console.log("Parsed token:", parsedToken);

    if (!parsedToken) {
      console.error("Parsed token is null");
      // navigate("/");
      return;
    }

    const userId = parsedToken.id;
    const accessToken = parsedToken.access_token;

    console.log("Parsed userId:", userId);
    console.log("Parsed accessToken:", accessToken);

    if (!userId || !accessToken) {
      console.error("Missing userId or accessToken in parsed token");
      navigate("/");
      return;
    }

    checkAuth(userId, accessToken).then(() => fetchGameHistories(userId));
  }, [cookie.token]);

  const genres = Array.from(
    new Set(gameHistories.map((history) => history.genre))
  );

  return (
    <div className="flex flex-col items-center w-full mx-auto pt-4 bg-white text-gray-800 p-2 min-h-screen dark:bg-custom-background">
      <div className="w-full mx-auto mt-20">
        <div
          className="w-full p-4 mb-9 flex justify-around items-center"
          style={{ borderRadius: "50px", height: "50px" }}
        >
          {genres.map((genre) => (
            <button
              key={genre}
              className={`px-4 py-2 w-1/4 text-center rounded-full 
                ${
                  genre === selectedGenre
                    ? "bg-custom-violet text-white"
                    : "dark:text-white hover:bg-custom-violet hover:text-white"
                }`}
              style={{ borderRadius: "50px" }}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {gameHistories
            .filter((history) => history.genre === selectedGenre)
            .map((history) => (
              <div
                key={history.gameId}
                className="rounded-lg overflow-hidden cursor-pointer"
                onClick={() =>
                  navigate(`/game-ending`, {
                    state: {
                      prompt: history.story,
                      genre: history.genre,
                      image: history.imageUrl,
                    },
                  })
                }
              >
                <img
                  src={history.imageUrl || "/default-thumbnail.jpg"}
                  alt={`${history.genre} Thumbnail`}
                  className="w-full object-cover h-54"
                />
                <p className="text-center mt-2 text-gray-800 dark:text-white">
                  {history.story.slice(0, 20)}...
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
