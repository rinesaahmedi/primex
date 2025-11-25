import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false); // State for Voice Mode
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
    setIsTyping(true);

    try {
      // B. Send to backend (Pass includeAudio flag)
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.text,
          includeAudio: isVoiceOn // <--- Tell backend if we want sound
        })
      });

      const data = await response.json();

      // C. Add Bot Response
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);

      // D. Play Audio if it exists
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play().catch(e => console.error("Audio play error:", e));
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the server.",
        sender: "bot"
      }]);
    } finally {
      setIsTyping(false);
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
          
          {/* --- HEADER (Cleaned up) --- */}
          <div className="bg-[#1e105c] p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide">Support Assistant</span>
            </div>
            
            {/* Close Button Only */}
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* --- Messages Area --- */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "self-end bg-[#1e105c] text-white rounded-t-xl rounded-bl-xl"
                      : "self-start bg-white border border-gray-200 text-gray-800 rounded-t-xl rounded-br-xl"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="self-start bg-white border border-gray-200 px-4 py-3 rounded-t-xl rounded-br-xl shadow-sm w-fit">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* --- Input Area (Voice Button Moved Here) --- */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              
              {/* VOICE TOGGLE BUTTON (Left of Input) */}
              <button 
                onClick={() => setIsVoiceOn(!isVoiceOn)}
                className={`p-2 rounded-full transition-all shrink-0 ${
                  isVoiceOn 
                    ? "bg-[#1e105c]/10 text-[#1e105c]" // Active State
                    : "text-gray-400 hover:text-[#1e105c] hover:bg-gray-100" // Inactive State
                }`}
                title={isVoiceOn ? "Turn Voice Off" : "Turn Voice On"}
              >
                {isVoiceOn ? (
                  // Sound On Icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                     <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                     <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                ) : (
                  // Sound Off Icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                  </svg>
                )}
              </button>

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
                className={`p-2.5 rounded-full text-white transition-all shadow-md shrink-0 ${
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

      {/* --- Main Toggle Button --- */}
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