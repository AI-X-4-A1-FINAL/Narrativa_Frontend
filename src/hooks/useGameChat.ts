import { useState } from 'react';
import { useMessageManagement } from './useMessageManagement';

interface UseGameChatProps {
  genre: string;
  currentStage: number;
  initialStory?: string;
  tags: string[];
  image: string;
}

export const useGameChat = ({
  genre,
  currentStage,
  initialStory = "",
  tags,
  image,
}: UseGameChatProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // 이제 필요한 props를 전달하여 useMessageManagement을 호출합니다.
  const {
    allMessages,
    currentMessages,
    choices,
    loading,
    fetchOpponentMessage,
    messagesEndRef,
    storyId, // storyId를 반환받습니다.
  } = useMessageManagement({
    genre,
    currentStage,
    initialStory,
    userInput,              // 추가된 userInput
    previousUserInput: "",  // 초기값
    conversationHistory,    // 대화 기록
    tags,
    image,
  });

  // 선택한 메시지를 전송하는 함수
  const sendMessage = async (choice: string) => {
    await fetchOpponentMessage(choice); // AI와 상호작용
  };

  return {
    allMessages,
    currentMessages,
    choices,
    loading,
    sendMessage,
    messagesEndRef,
    storyId, // storyId를 외부에서 사용할 수 있도록 반환
    userInput,
    setUserInput,
    conversationHistory,
  };
};
