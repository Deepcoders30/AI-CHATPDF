import { useState } from "react";
import ChatIcon from "../assets/sent-messsage-icon.png";

const ChatInput = ({
  doc_id,
  chatHistoryRetriever,
  updateAnswer,
}: {
  doc_id: string;
  chatHistoryRetriever: (newMessage: {
    question: string;
    answer: string;
  }) => number;
  updateAnswer: (index: number, answer: string) => void;
}) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    const currentIndex = chatHistoryRetriever({ question: text, answer: "" });

    setText("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        body: JSON.stringify({
          doc_id: doc_id,
          question: text,
        }),
      });

      const data = await response.json();
      const answer = data.answer;

      updateAnswer(currentIndex, answer);
    } catch (e) {
      console.log(e);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="px-[60px] md:px-[120px]">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center shadow-lg border border-gray-200 rounded-md px-12 py-4"
      >
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Send a message..."
          className="focus:outline-0 w-full"
        />
        <button type="submit">
          {" "}
          <span className="cursor-pointer">
            <img src={ChatIcon} alt="chat-icon" />
          </span>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
