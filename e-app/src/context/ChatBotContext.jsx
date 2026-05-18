import { createContext, useContext, useState } from "react";

const ChatBotContext = createContext();

export function ChatBotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChatBot = () => setIsOpen(true);
  const closeChatBot = () => setIsOpen(false);
  const toggleChatBot = () => setIsOpen(!isOpen);

  return (
    <ChatBotContext.Provider value={{ isOpen, setIsOpen, openChatBot, closeChatBot, toggleChatBot }}>
      {children}
    </ChatBotContext.Provider>
  );
}

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error("useChatBot must be used within ChatBotProvider");
  }
  return context;
};
