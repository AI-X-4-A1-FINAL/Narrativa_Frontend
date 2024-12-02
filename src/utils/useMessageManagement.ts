// src/utils/useMessageManagement.ts
import { useState, useEffect } from "react";
import { Message, MessageManagementProps } from "./messageTypes";
import axios from "../api/axiosInstance";

export const useMessageManagement = ({
  initialStory,
  currentStage,
  genre,
}: MessageManagementProps) => {
  const [allMessages, setAllMessages] = useState<{ [key: number]: Message[] }>(
    {}
  );
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [inputCount, setInputCount] = useState<number>(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [responses, setResponses] = useState<any[]>([]);

  const addMessage = (message: Message, stage: number) => {
    setCurrentMessages((prev) => [...prev, message]);
    setAllMessages((prev) => ({
      ...prev,
      [stage]: [...(prev[stage] || []), message],
    }));
  };

  const fetchOpponentMessage = async (userInput: string, stage: number) => {
    setLoading(true);
    try {
      const conversationHistory = (allMessages[stage - 1] || []).map(
        (msg: Message) => `${msg.sender}: ${msg.text}`
      );

      const requestBody = {
        genre: genre || "",
        currentStage: stage > 0 ? stage : 1,
        userInput: userInput || "",
        conversationHistory: conversationHistory,
      };

      const response = await axios.post("/generate-story/chat", requestBody);
      setResponses((prevResponses) => [...prevResponses, response.data]);

      if (response.data && response.data.story) {
        const newMessage: Message = {
          sender: "opponent",
          text: response.data.story,
        };
        addMessage(newMessage, stage);
      }
    } catch (error) {
      console.error("Error in fetchOpponentMessage:", error);
      const errorMessage: Message = {
        sender: "opponent",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
      };
      addMessage(errorMessage, stage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (userInput: string, stage: number) => {
    if (userInput.trim() === "" || loading || inputDisabled) {
      const newMessage: Message = {
        sender: "opponent",
        text: "답을 입력해주세요",
      };
      addMessage(newMessage, stage);
      return;
    }

    const userMessage: Message = { sender: "user", text: userInput };
    addMessage(userMessage, stage);

    const newInputCount = inputCount + 1;
    setInputCount(newInputCount);

    if (newInputCount >= 5) {
      setInputDisabled(true);
      const nextMessage: Message = {
        sender: "opponent",
        text: "다음 스테이지로 넘어가세요.",
      };
      addMessage(nextMessage, stage);
      await fetchOpponentMessage(userInput, stage);
    } else {
      await fetchOpponentMessage(userInput, stage);
    }

    return newInputCount;
  };

  useEffect(() => {
    if (initialStory && currentStage === 0) {
      const initialMessage: Message = {
        sender: "opponent",
        text: initialStory,
      };
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [initialMessage],
      }));
      setCurrentMessages([initialMessage]);
    }
  }, [initialStory, currentStage]);

  useEffect(() => {
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);
  }, [currentStage, allMessages]);

  return {
    allMessages,
    currentMessages,
    inputCount,
    inputDisabled,
    loading,
    responses,
    handleSendMessage,
    fetchOpponentMessage,
    setInputCount,
    setInputDisabled,
  };
};
