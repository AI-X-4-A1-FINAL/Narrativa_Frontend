import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { Cookies } from "react-cookie";
import { getValue } from "@testing-library/user-event/dist/utils";

interface WorldViewReturn {
  worldView: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWorldView = (
  genre: string,
  tags: string[],
  initialStory: string,
  isLoading: boolean
): WorldViewReturn => {
  const [worldView, setWorldView] = useState<string>(initialStory || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cookies = new Cookies();
  const userId: number = Number(cookies.get("id"));

  const fetchWorldView = async () => {
    if (!initialStory || isLoading) {
      setLoading(true);
      try {
        console.log("Sending request:", { genre, tags, userId });
        const response = await axios.post(
          `${process.env.REACT_APP_SPRING_URI}/generate-story/start`,
          {
            genre,
            tags,
            userId,
          }
        );
        console.log("Response received:", response.data);
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

  useEffect(() => {
    if (genre) {
      fetchWorldView();
    }
  }, [genre, initialStory, isLoading]);

  return {
    worldView,
    loading,
    error,
    refetch: fetchWorldView,
  };
};
