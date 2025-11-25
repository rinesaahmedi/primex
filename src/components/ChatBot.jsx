import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Store the conversation history
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 How can I help you with our AI services today?",
      sender: "bot",
    },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // 3. Handle sending the message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // A. Add User Message immediately
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true); // Show typing indicator

    try {
      // B. Send to your backend
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();

      // C. Add Bot Response from Backend
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply, // The answer from OpenAI/Pinecone
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add an error message to the chat
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the server. Please try again later.",
        sender: "bot"
      }]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* --- The Chat Window --- */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-[#1e105c] p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide">Support Assistant</span>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "self-end bg-[#1e105c] text-white rounded-t-xl rounded-bl-xl"
                      : "self-start bg-white border border-gray-200 text-gray-800 rounded-t-xl rounded-br-xl"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {/* Typing Indicator Bubble */}
              {isTyping && (
                <div className="self-start bg-white border border-gray-200 px-4 py-3 rounded-t-xl rounded-br-xl shadow-sm w-fit">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1e105c]/50 transition-all text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className={`p-2.5 rounded-full text-white transition-all shadow-md ${
                  !inputText.trim() 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-[#1e105c] hover:bg-[#2a1680] hover:scale-105 active:scale-95"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Toggle Button --- */}
      <button
        onClick={toggleChat}
        className="group w-14 h-14 bg-[#1e105c] rounded-full shadow-lg shadow-[#1e105c]/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;