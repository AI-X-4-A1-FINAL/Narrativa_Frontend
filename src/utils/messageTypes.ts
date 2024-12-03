// src/utils/MessageTypes.ts
export interface Message {
  sender: "user" | "opponent";
  text: string;
}

export interface MessageManagementProps {
  genre: string;
  currentStage: number;
  initialStory?: string;
  userInput: string;
  previousUserInput: string;
  conversationHistory: string[];
  tags: string[];
  image: string;
}

export interface LocationState {
  genre: string;
  tags: string[];
  image: string;
  initialStory?: string;
  userInput?: string;
  previousUserInput?: string;
  isLoading?: boolean;
}
