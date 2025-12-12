import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../apiBase";

const ChatBot = () => {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const audioPlayerRef = useRef(new Audio());
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t("chatbot.welcome_message"),
      sender: "bot",
    },
  ]);

  // --- FIX 1: Lock Background Scroll ---
  // This prevents the main site from scrolling when the chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Lock scroll
      // iOS specific fix to prevent rubber-banding if needed, 
      // but overflow: hidden usually works for the body.
    } else {
      document.body.style.overflow = "unset"; // Unlock scroll
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      setMessages([{ ...messages[0], text: t("chatbot.welcome_message") }]);
    }
  }, [i18n.language]);

  const toggleChat = () => {
    if (isOpen) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsVoiceOn(false);
    }
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (!isOpen) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsVoiceOn(false);
    }
  }, [isOpen]);

  const handleVoiceToggle = async () => {
    if (isVoiceOn) {
      setIsVoiceOn(false);
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    } else {
      setIsVoiceOn(true);
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.sender === "bot") {
        await fetchAndPlayAudio(lastMsg.text);
      }
    }
  };

  const fetchAndPlayAudio = async (text) => {
    try {
      audioPlayerRef.current.pause();
      const response = await fetch(apiUrl("/api/speak"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: i18n.language }),
      });
      const data = await response.json();
      if (data.audio) {
        audioPlayerRef.current.src = `data:audio/mp3;base64,${data.audio}`;
        audioPlayerRef.current.play().catch((e) => console.error("Play error:", e));
      }
    } catch (err) {
      console.error("TTS fetch error:", err);
    }
  };

  const handleSendMessage = async (overrideText = null) => {
    const textToSend = typeof overrideText === "string" ? overrideText : inputText;
    if (!textToSend.trim()) return;

    audioPlayerRef.current.pause();
    const userMessage = { id: Date.now(), text: textToSend, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    const historyPayload = messages.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          includeAudio: isVoiceOn,
          language: i18n.language,
          history: historyPayload,
        }),
      });
      const data = await response.json();
      const botMessage = { id: Date.now() + 1, text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      if (data.audio && isVoiceOn) {
        audioPlayerRef.current.src = `data:audio/mp3;base64,${data.audio}`;
        audioPlayerRef.current.play().catch((e) => console.error("Audio play error:", e));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert(t("chatbot.browser_not_supported"));
    audioPlayerRef.current.pause();
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language.startsWith("de") ? "de-DE" : "en-US";
    recognition.interimResults = false;
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[1000] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-32px)] sm:w-[350px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* HEADER */}
          <div className="bg-[#1e105c] p-4 flex justify-between items-center text-white shrink-0 shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide">{t("chatbot.header_title")}</span>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto overscroll-contain touch-pan-y">
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
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className={`underline break-all ${msg.sender === "user" ? "text-cyan-300" : "text-blue-600"}`} />
                      ),
                      p: ({ node, ...props }) => <p {...props} className="m-0" />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))}
              {isTyping && <div className="self-start text-gray-400 text-xs ml-4">{t("chatbot.typing")}</div>}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="p-2 sm:p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-1.5 md:gap-2">
              <button
                onClick={handleVoiceToggle}
                className={`p-2 rounded-full transition-all shrink-0 ${isVoiceOn ? "bg-green-100 text-green-600" : "text-gray-400"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                </svg>
              </button>

              <button
                onClick={startListening}
                className={`p-2 rounded-full transition-all shrink-0 ${isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-400"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              </button>

              {/* FIX 2: PREVENT ZOOM */}
              {/* Changed text-sm to text-base (16px) on mobile, and text-sm on desktop */}
              {/* Added min-w-0 to prevent flexbox overflow */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? t("chatbot.listening") : t("chatbot.type_placeholder")}
                className="flex-1 min-w-0 px-3 py-2 bg-gray-100 rounded-full text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-[#1e105c]/50 text-gray-700"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition-all shadow-md shrink-0 ${
                  !inputText.trim() ? "bg-gray-300" : "bg-[#1e105c]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 translate-x-0.5" // Small fix to visually center the arrow
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button onClick={toggleChat} className="w-14 h-14 bg-[#1e105c] rounded-full shadow-lg text-white flex items-center justify-center">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBot;