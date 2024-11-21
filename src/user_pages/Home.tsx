import React from "react";
import { useNavigate } from "react-router-dom";

interface Genre {
  name: string;
  tags: string[];
  image: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 장르 데이터 배열
  const genres: Genre[] = [
    {
      name: "Survival",
      tags: ["서바이벌", "살아남기"],
      image: "/images/survival.jpeg",
    },
    {
      name: "Romance",
      tags: ["사랑", "드라마"],
      image: "/images/romance.png",
    },
    {
      name: "Simulation",
      tags: ["시뮬레이션", "라이프"],
      image: "/images/simulation.png",
    },
    {
      name: "Mystery",
      tags: ["스릴러", "범죄"],
      image: "/images/detective.jpg",
    },
  ];

  // 장르 클릭 핸들러
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
    <div className="w-full text-black min-h-screen overflow-y-auto bg-gray-50 mt-2">
      <div className="flex flex-col items-center">
        {genres.map((genre) => (
          <div
            key={genre.name}
            className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-gray-50 shadow-lg mb-6 group"
          >
            <div
              className="relative cursor-pointer"
              onClick={() => handleClick(genre.name, genre.tags, genre.image)}
            >
              <img
                src={genre.image}
                alt={`${genre.name} Genre Cover`}
                className="w-full h-[400px] object-cover rounded-2xl"
              />
              {/* Overlay for larger screens: visible on hover */}
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
