import React from "react";
import ChatBot from "../components/ChatBot";

const ChatBotPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8 animate-enter">
      <div className="w-full max-w-2xl">
        <ChatBot />
      </div>
    </div>
  );
};

export default ChatBotPage;
