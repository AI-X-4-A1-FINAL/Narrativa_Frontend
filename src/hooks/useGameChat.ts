import { useState } from 'react';
import { useMessageManagement } from '../utils/useMessageManagement';

interface UseGameChatProps {
  genre: string;
  currentStage: number;
  initialStory?: string;
  previousUserInput?: string;
  tags: string[];
  image: string;
}

export const useGameChat = ({
  genre,
  currentStage,
  initialStory = "",
  previousUserInput = "",
  tags,
  image,
}: UseGameChatProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  const {
    allMessages,
    currentMessages,
    inputCount,
    inputDisabled,
    loading,
    responses,
    handleSendMessage,
    setInputCount,
    setInputDisabled,
    messagesEndRef,
  } = useMessageManagement({
    genre,
    currentStage,
    initialStory,
    userInput,
    previousUserInput,
    conversationHistory,
    tags,
    image,
  });

  const sendMessage = async () => {
    const newCount = await handleSendMessage(userInput, currentStage);
    if (newCount !== undefined) {
      setUserInput("");
    }
  };

  return {
    userInput,
    setUserInput,
    conversationHistory,
    allMessages,
    currentMessages,
    inputCount,
    inputDisabled,
    loading,
    responses,
    sendMessage,
    setInputCount,
    setInputDisabled,
    messagesEndRef,
  };
};