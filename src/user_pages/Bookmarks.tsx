import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useDarkMode } from "../Contexts/DarkModeContext";
import { parseCookieKeyValue } from "../api/cookie";

interface GameHistory {
  gameId: number;
  story: string;
  imageUrl: string | null;
  genre: string;
}

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [gameHistories, setGameHistories] = useState<GameHistory[]>([]);
  const [cookie] = useCookies(["token"]);

  // 미리 정의된 장르 리스트
  const predefinedGenres = ["전체", "생존", "추리", "연애", "성장"];

  const genreMapping: { [key: string]: string } = {
    생존: "Survival",
    추리: "Mystery",
    연애: "Romance",
    성장: "Simulation",
  };

  // 장르별 기본 이미지 경로
  const defaultImages: { [key: string]: string } = {
    Survival: "/images/survival.webp",
    Romance: "/images/romance.webp",
    Simulation: "/images/simulation.webp",
    Mystery: "/images/detective.webp",
  };

  // Convert byte array to base64 image
  const convertByteArrayToImage = (
    byteArray: number[] | null
  ): string | null => {
    if (!byteArray || byteArray.length === 0) return null;

    try {
      // Convert byte array to base64
      const uint8Array = new Uint8Array(byteArray);
      const base64Image = btoa(
        String.fromCharCode.apply(null, Array.from(uint8Array))
      );
      return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
      console.error("Error converting byte array to image:", error);
      return null;
    }
  };

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

      // Transform the response to convert byte array to base64 images
      const transformedHistories: GameHistory[] = response.data.map(
        (item: any) => ({
          ...item,
          imageUrl: convertByteArrayToImage(item.imageUrl),
        })
      );

      setGameHistories(transformedHistories);
    } catch (error) {
      console.error("Error fetching game histories:", error);
    }
  };

  useEffect(() => {
    const cookieToken = cookie.token;
    const parsedToken = parseCookieKeyValue(cookieToken);

    if (!parsedToken) {
      console.error("Parsed token is null");
      navigate("/");
      return;
    }

    const userId = parsedToken.id;

    if (!userId) {
      console.error("Missing userId in parsed token");
      navigate("/");
      return;
    }

    fetchGameHistories(userId);
  }, [cookie.token, navigate]);

  return (
    <div className="flex flex-col items-center w-full mx-auto pt-5 bg-white text-gray-800 p-2 min-h-screen dark:bg-custom-background">
      <div className="w-full mx-auto mt-20">
        {/* 장르 필터 버튼 */}
        <div
          className="w-full p-4 mb-9 flex justify-center gap-4"
          style={{ borderRadius: "60px", height: "80px" }}
        >
          {predefinedGenres.map((genre) => (
            <button
              key={genre}
              className={`flex-1 max-w-[150px] px-4 py-2 text-center rounded-full ${
                genre === selectedGenre || (genre === "전체" && !selectedGenre)
                  ? "bg-custom-violet text-white"
                  : "dark:text-white hover:bg-custom-violet hover:text-white"
              }`}
              style={{ borderRadius: "60px" }}
              onClick={() => setSelectedGenre(genre === "전체" ? null : genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* 게임 히스토리 목록 */}
        <div className="grid grid-cols-2 gap-6 justify-items-center items-center">
          {gameHistories
            .filter((history) =>
              !selectedGenre
                ? true
                : history.genre === genreMapping[selectedGenre]
            )
            .map((history) => {
              // imageUrl이 없으면 장르별 기본 이미지를 사용
              const imageToUse = history.imageUrl // base64 이미지 사용
                ? history.imageUrl
                : defaultImages[history.genre]; // 기본 이미지 사용

              return (
                <div
                  key={history.gameId}
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{ width: "200px", height: "300px" }} // 카드 크기 고정
                  onClick={() =>
                    navigate(`/game-ending`, {
                      state: {
                        prompt: history.story,
                        genre: history.genre,
                        image: imageToUse,
                      },
                    })
                  }
                >
                  <img
                    src={imageToUse}
                    alt={`${history.genre} Thumbnail`}
                    className="w-full h-4/5 object-cover rounded-t-lg"
                  />
                  <p className="text-center mt-2 text-gray-800 dark:text-white truncate px-2">
                    {history.story}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
