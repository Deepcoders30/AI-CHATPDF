import UserChatLogo from "../assets/user-chat.png";
import ChatLogo from "../assets/chat-logo.png";
import React from "react";

const ChatInterface = ({
  chatHistory,
}: {
  chatHistory: { question: string; answer: string }[];
}) => {
  return (
    <div className="px-[60px] md:px-[120px]">
      <div className="flex flex-col gap-y-14 p-16 h-[540px] overflow-y-auto">
        {chatHistory.map((data, index) => (
          <React.Fragment key={index}>
            <div className="flex gap-6">
              <img
                className="w-[36px] h-[36px]"
                src={UserChatLogo}
                alt="user-chat-logo"
              />
              <p>{data.question}</p>
            </div>

            <div className="flex gap-6">
              <img
                className="w-[36px] h-[36px]"
                src={ChatLogo}
                alt="chat-logo"
              />
              <p>{data.answer === "" ? "Thinking..." : data.answer}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;
