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
      tags: ["Apocalypse", "Survival", "Disaster"],
      image: "/images/survival.jpeg",
    },
    {
      name: "Romance",
      tags: ["Love", "Drama", "Relationships"],
      image: "/images/romance.png",
    },
    {
      name: "Simulation",
      tags: ["Strategy", "Management", "Life"],
      image: "/images/simulation.png",
    },
    {
      name: "Mystery",
      tags: ["Thriller", "Suspense", "Crime"],
      image: "/images/mystery.png",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {genres.map((genre) => (
          <div
            key={genre.name}
            className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-lg bg-white"
          >
            <div className="text-left font-semibold text-gray-600 opacity-90 mb-2 p-4">
              {genre.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-sm font-semibold mr-2 px-3 py-1 rounded-full bg-gray-200"
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
                className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{genre.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
