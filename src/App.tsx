
import React, { useEffect, useRef, useState } from 'react'
import ChatbotIcon from "./components/ChatbotIcon";
import Chatform from "./components/Chatform";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./CompanyInfo"



function App() {

  // when add company relevent data
  // const [chatHistroy, setChatHistroy] = useState([
  //   {
  //     hideInChat: true,
  //     role: 'model',
  //     text: companyInfo
  //   }
  // ]);
  const [chatHistroy, setChatHistroy] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const inputRef = useRef();
  const chatbodyRef = useRef();

  useEffect(() => {
    if (chatbodyRef.current) {
      chatbodyRef.current.scrollTo({
        top: chatbodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistroy]);

  const generateBotResponse = async (updatedHistory: { role: any; text: any; }[]) => {
    const updateHistory = (text: any) => {
      setChatHistroy((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };

    const history = updatedHistory.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const URL = import.meta.env.VITE_GEMNI_AI_URL;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(URL, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error?.message || "Something went wrong!");
      }

      const res = await response.json();
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from bot";
      updateHistory(text);
    } catch (error) {
      console.error("Error generating bot response:", error);
    }
  };

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();

    if (!userMessage) return;

    // Create a new history array to include the user's message
    const updatedHistory = [
      ...chatHistroy,
      { role: "user", text: userMessage },
      { role: "model", text: "Thinking..." },
    ];

    // Update the chat history state
    setChatHistroy(updatedHistory);

    // Clear the input field
    inputRef.current.value = "";

    // Call the bot response generator with the updated history
    generateBotResponse(updatedHistory);
  };


  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">
          mode_comment
        </span>
        <span className="material-symbols-rounded">
          close
        </span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">
              Chat-bot
            </h2>
            <button onClick={() => setShowChatbot(prev => !prev)} className="material-symbols-rounded">
              keyboard_arrow_down
            </button>
          </div>
        </div>
        <div ref={chatbodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              hi, there  <br /> How can i help you today?
            </p>
          </div>
          {chatHistroy.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <Chatform inputRef={inputRef} handleformSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  )
}

export default App