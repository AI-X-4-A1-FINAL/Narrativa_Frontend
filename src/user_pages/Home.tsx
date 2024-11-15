import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 장르 선택 함수
  const handleClick = (genre: string, tags: string[], image: string) => {
    navigate("/game-intro", {
      state: {
        genre,
        tags,
        image,
      },
    });
  };

  return (
    <div className="w-full p-8 text-black min-h-screen overflow-y-auto">
      <div className="w-full space-y-6">
        {/* Genre */}

        {/* 첫 번째 이미지 */}
        <div className="w-full max-w-lg max-h-md mx-auto">
          <div className="text-left font-semibold opacity-90 mb-2">
            #생존 #아포칼립스
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/choori.jpeg"
              alt="Romance Genre Cover"
              className="w-full h-[600px] rounded-2xl object-cover"
              onClick={() =>
                handleClick(
                  "생존",
                  ["아포칼립스", "생존", "재난"],
                  "/images/choori.jpeg"
                )
              }
            />
          </div>
        </div>

        {/* 두 번째 이미지 */}
        <div className="w-full">
          <div className="text-left font-semibold opacity-90">
            # 로맨스 # 연애
          </div>
          <div className=" rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/love.png"
              alt="Romance Genre Cover"
              className="w-full h-[600px] "
              onClick={() =>
                handleClick(
                  "연애",
                  ["연애", "시뮬레이션", "로맨스", "로맨스 판타지"],
                  "/images/love.png"
                )
              }
            />
          </div>
        </div>

        {/* 세 번째 이미지 */}
        <div className="w-full">
          <div className="text-left font-semibold opacity-90">
            # 육성 # 성장물
          </div>
          <div className=" rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/raise.png"
              alt="Mystery Genre Cover"
              className="w-full h-[600px] "
              onClick={() =>
                handleClick(
                  "성장물",
                  ["육성", "시뮬레이션", "키우기", "성장물"],
                  "/images/love.png"
                )
              }
            />
          </div>
        </div>

        {/* 네 번째 이미지 */}
        <div className="w-full">
          <div className="text-left font-semibold opacity-90">
            # 추리 # 미스테리
          </div>
          <div className=" rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/detective.jpg"
              alt="Romance Genre Cover"
              className="w-full h-[600px]"
              onClick={() =>
                handleClick(
                  "추리",
                  ["추리", "미스테리", "모험"],
                  "/images/love.png"
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
