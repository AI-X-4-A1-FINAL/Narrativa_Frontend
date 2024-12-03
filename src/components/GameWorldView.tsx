import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { Loader2, ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
  initialStory: string;
  isLoading?: boolean;
  userId: number;
}

const useWorldView = (genre: string, tags: string[], initialStory: string, isLoading: boolean) => {
  const [worldView, setWorldView] = useState<string>(initialStory || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorldView = async () => {
      if (!initialStory || isLoading) {
        try {
          const response = await axios.post("/generate-story/start", {
            genre,
            tags,
            userId: Number,
          });
          setWorldView(response.data.story);
          setError(null);
        } catch (error) {
          console.error("Error fetching world view:", error);
          setError("세계관을 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
          setLoading(false);
        }
      } else {
        setWorldView(initialStory);
        setLoading(false);
      }
    };

    if (genre) {
      fetchWorldView();
    }
  }, [genre, initialStory, isLoading, tags]);

  return { worldView, loading, error };
};

const GameWorldView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory, isLoading } = (location.state as LocationState) || {};
  const [bgImage, setBgImage] = useState<string>(image);
  
  const { userId, isAuthenticated } = useAuth();
  
  const { musicUrl, isPlaying, togglePlayPause, initializeMusic } = useAudio();
  
  const { worldView, loading, error } = useWorldView(genre, tags, initialStory, isLoading || false);

  useEffect(() => {
    if (genre && isAuthenticated) {
      initializeMusic(genre);
    }
  }, [genre, isAuthenticated, initializeMusic]);

  const handleStartGame = async () => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    try {
      navigate("/game-page", {
        state: {
          genre,
          tags,
          image: bgImage,
          initialStory: worldView,
          userId
        },
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  if (!genre || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-white text-xl">Invalid access. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="World View Background"
          className="w-full h-full object-cover brightness-50 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50" />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-4 flex justify-between w-full px-4 z-10">
        <div className="flex items-center space-x-4">
          {musicUrl && (
            <button
              onClick={togglePlayPause}
              className="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-custom-purple 
                       transition-colors flex items-center justify-center"
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-custom-purple 
                   transition-colors flex items-center justify-center"
        >
          <ArrowBigLeftDash />
        </button>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center w-full h-full max-w-4xl max-h-[90vh] gap-4">
          <h1 className="text-4xl font-bold text-center py-4 text-white drop-shadow-lg">
            {genre} 세계관
          </h1>
          
          {/* World View Content */}
          <div className="flex-1 w-full overflow-y-auto bg-black bg-opacity-50 rounded-lg p-6 
                       backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-lg">세계관을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-red-400">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-white underline"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="text-lg leading-relaxed whitespace-pre-line">
                {worldView}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartGame}
            disabled={loading || !!error}
            className="bg-custom-violet hover:bg-custom-purple text-white font-bold py-3 px-8 
                     rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     transform hover:scale-105 active:scale-95 duration-200"
          >
            {loading ? "로딩중..." : error ? "다시 시도" : "게임 시작하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameWorldView;