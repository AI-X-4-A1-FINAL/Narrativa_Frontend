import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import AuthGuard from "../api/accessControl";
import { Loader2, ArrowBigLeftDash } from "lucide-react";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
  initialStory: string;
  isLoading?: boolean;
}

const GameWorldView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory } =
    (location.state as LocationState) || {};
  const [cookies] = useCookies(["id"]);
  const [worldView, setWorldView] = useState<string>(initialStory || "");
  const [loading, setLoading] = useState(true);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fetchingStory, setFetchingStory] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgImage, setBgImage] = useState<string>(image);

  useEffect(() => {
    const checkAuth = async () => {
      if (!cookies.id || !(await AuthGuard(cookies.id))) {
        navigate("/");
      }
    };
    checkAuth();
  }, [cookies.id, navigate]);

  useEffect(() => {
    const fetchStory = async () => {
      if (location.state?.isLoading) {
        try {
          const response = await axios.post("/generate-story/start", {
            genre,
            tags,
          });
          setWorldView(response.data.story);
        } catch (error) {
          console.error("Error fetching story:", error);
        } finally {
          setFetchingStory(false);
        }
      }
    };

    fetchStory();
  }, [location.state?.isLoading, genre, tags]);

  useEffect(() => {
    const fetchWorldView = async () => {
      if (!initialStory) {
        try {
          const response = await axios.get(`/api/world-view/${genre}`);
          setWorldView(response.data.content);
        } catch (error) {
          console.error("Error fetching world view:", error);
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
  }, [genre, initialStory]);

  useEffect(() => {
    const fetchMusic = async () => {
      setMusicLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SPRING_URI}/api/music/random?genre=${genre}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMusicUrl(data.url);
      } catch (error) {
        console.error("Error fetching music:", error);
        setMusicUrl(null);
      } finally {
        setMusicLoading(false);
      }
    };

    if (genre) {
      fetchMusic();
    }
  }, [genre]);

  useEffect(() => {
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch((error) => {
        console.error("Auto-play was prevented:", error);
      });
      setIsPlaying(true);
    }
  }, [musicUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStartGame = async () => {
    try {
      navigate("/game-page", {
        state: {
          genre,
          tags,
          image: bgImage,
          initialStory: worldView,
        },
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <div className="relative w-full h-screen text-white">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="World View Background"
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      <div className="absolute top-4 flex justify-between w-full px-4 z-10">
        <div>
          {musicLoading ? (
            <p>Loading music...</p>
          ) : musicUrl ? (
            <div className="flex items-center">
              <audio ref={audioRef} src={musicUrl} />
              <button
                onClick={togglePlayPause}
                className="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-custom-purple transition-colors flex items-center justify-center"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
            </div>
          ) : null}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-custom-purple transition-colors flex items-center justify-center"
        >
          <ArrowBigLeftDash />
        </button>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center w-full h-full max-w-4xl max-h-[90vh] gap-4">
          <h1 className="text-3xl font-bold text-center py-4">세계관</h1>
          <div
            className="flex-1 w-full overflow-y-auto bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm
           scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800"
          >
            {loading || fetchingStory ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-lg">세계관을 불러오는 중...</p>
              </div>
            ) : (
              <div className="text-base leading-normal whitespace-pre-line">
                {worldView}
              </div>
            )}
          </div>
          <button
            onClick={handleStartGame}
            disabled={loading || fetchingStory}
            className="bg-custom-violet hover:bg-custom-purple text-white font-bold py-3 px-8 rounded-lg
             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || fetchingStory ? "로딩중..." : "게임 시작하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameWorldView;
