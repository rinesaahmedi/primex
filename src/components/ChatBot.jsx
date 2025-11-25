import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Default to FALSE. You must click the Speaker icon to hear audio.
  const [isVoiceOn, setIsVoiceOn] = useState(false); 
  const [isListening, setIsListening] = useState(false); 

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 How can I help you with our AI services today?",
      sender: "bot",
    },
  ]);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // --- 1. HANDLE MESSAGE SENDING ---
  // We allow passing "overrideText" so the Microphone can send immediately
  const handleSendMessage = async (overrideText = null) => {
    const textToSend = typeof overrideText === "string" ? overrideText : inputText;

    if (!textToSend.trim()) return;

    // A. Add User Message
    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText(""); // Clear input
    setIsTyping(true);

    try {
      console.log("Sending to backend...", { text: textToSend, voice: isVoiceOn });

      // B. Send to backend
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          includeAudio: isVoiceOn // <--- MUST BE TRUE TO HEAR SOUND
        })
      });

      const data = await response.json();
      console.log("Backend response:", data);

      // C. Add Bot Response
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);

      // D. Play Audio
      if (data.audio) {
        console.log("Playing audio...");
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play().catch(e => console.error("Audio play error:", e));
      } else {
        console.log("No audio received from backend.");
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

  // --- 2. HANDLE MICROPHONE ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Browser not supported. Use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice recognized:", transcript);
      
      // Update the input box visually
      setInputText(transcript);
      
      // AUTO SEND: Immediately send the text to the bot
      handleSendMessage(transcript);
      
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* HEADER */}
          <div className="bg-[#1e105c] p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide">AI Assistant</span>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm ${msg.sender === "user" ? "self-end bg-[#1e105c] text-white rounded-t-xl rounded-bl-xl" : "self-start bg-white border border-gray-200 text-gray-800 rounded-t-xl rounded-br-xl"}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="self-start bg-white border border-gray-200 px-4 py-3 rounded-t-xl rounded-br-xl shadow-sm w-fit">
                  <div className="flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              
              {/* BUTTON 1: SPEAKER (HEAR THE BOT) */}
              <button 
                onClick={() => setIsVoiceOn(!isVoiceOn)}
                className={`p-2 rounded-full transition-all shrink-0 ${isVoiceOn ? "bg-green-100 text-green-600" : "text-gray-400 hover:text-green-600 hover:bg-gray-100"}`}
                title={isVoiceOn ? "Sound ON" : "Sound OFF"}
              >
                {isVoiceOn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" /></svg>
                )}
              </button>

              {/* BUTTON 2: MICROPHONE (RECORDING) */}
              <button 
                onClick={startListening}
                className={`p-2 rounded-full transition-all shrink-0 ${isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-400 hover:text-red-500 hover:bg-gray-100"}`}
                title="Speak to Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type a message..."}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1e105c]/50 transition-all text-gray-700 placeholder-gray-400"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className={`p-2.5 rounded-full text-white transition-all shadow-md shrink-0 ${!inputText.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-[#1e105c] hover:bg-[#2a1680] hover:scale-105 active:scale-95"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN CHAT BUTTON */}
      <button onClick={toggleChat} className="group w-14 h-14 bg-[#1e105c] rounded-full shadow-lg shadow-[#1e105c]/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300">
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;