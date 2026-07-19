import api from "./axiosClient";
import type { ChatRequest, ChatResponse } from "../types/chat";

export const askChatQuestion = async (question: string): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", { question } as ChatRequest);
  return response.data;
};