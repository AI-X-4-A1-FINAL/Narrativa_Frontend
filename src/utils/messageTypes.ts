// src/utils/MessageTypes.ts
export interface Message {
  sender: "user" | "opponent";
  text: string;
}

export interface MessageManagementProps {
  initialStory?: string;
  currentStage: number;
  genre?: string;
}

export interface LocationState {
  genre: string;
  tags: string[];
  image: string;
  userInput: string;
  initialStory: string;
  previousUserInput: string;
}