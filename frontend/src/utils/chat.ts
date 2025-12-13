export interface ChatMessage {
  id: string;
  senderId: "user" | "assistant" | "system";
  message: string;
}
export interface Chat {
  chatId: string;
  title: string;
}
