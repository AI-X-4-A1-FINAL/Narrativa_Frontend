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
    <div className="w-full p-8 text-black min-h-screen overflow-y-auto bg-gray-50">
      <div className="">
        {genres.map((genre) => (
          <div
            key={genre.name}
            className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden bg-gray-50"
          >
            <div className="text-left font-semibold text-gray-600 opacity-100 ">
              {genre.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-md font-semibold mr-2 px-1 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleClick(genre.name, genre.tags, genre.image)}
            >
              <img
                src={genre.image}
                alt={`${genre.name} Genre Cover`}
                className="w-full h-full object-cover rounded-2xl mb-8"
              />
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
