import { useState } from "react";
import ChatInput from "../components/ChatInput";
import Navbar from "../components/Navbar";
import ChatInterface from "../components/ChatInterface";

const Home = () => {
  const [doc_id, setDocId] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);

  const getDocId = (doc_id: string) => {
    setDocId(doc_id);
  };

  const chatHistoryRetriever = (newMessage: {
    question: string;
    answer: string;
  }) => {
    const currentIndex = chatHistory.length;
    setChatHistory((prev) => [...prev, newMessage]);

    return currentIndex;
  };

  const updateAnswer = (index: number, answer: string) => {
    setChatHistory((prev) => {
      const newUpdatedHistory = [...prev];
      newUpdatedHistory[index] = { ...newUpdatedHistory[index], answer };
      return newUpdatedHistory;
    });
  };

  return (
    <div className="h-screen">
      <Navbar getDocId={getDocId} />
      <div>
        <ChatInterface chatHistory={chatHistory} />
        <ChatInput
          doc_id={doc_id}
          chatHistoryRetriever={chatHistoryRetriever}
          updateAnswer={updateAnswer}
        />
      </div>
    </div>
  );
};

export default Home;
