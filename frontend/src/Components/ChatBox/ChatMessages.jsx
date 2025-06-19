import React, { useEffect, useRef, menuRef } from "react";
import getBaseUrl from "../../Url";
import { toast } from "react-toastify";
const TypingIndicator = ({ typingUser }) => (
  <div className="typing-indicator flex items-center mb-2">
    <img
      src={typingUser.pic}
      alt={typingUser.name}
      className="w-8 h-8 rounded-full mr-2 border border-[#8A0032] object-cover shadow-sm"
    />
    <div className="bg-[#D76C82] bg-opacity-20 p-2 rounded-lg flex items-center">
      <span className="mr-2 text-[#3D0301] text-sm">
        {typingUser.name} is typing
      </span>
      <div className="dots inline-flex space-x-1">
        <div className="dot w-2 h-2 rounded-full bg-[#8A0032] animate-bounce"></div>
        <div
          className="dot w-2 h-2 rounded-full bg-[#8A0032] animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="dot w-2 h-2 rounded-full bg-[#8A0032] animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  </div>
);

const ChatMessages = ({ messages, user, loading, isTyping, typingUser }) => {
  const messagesEndRef = useRef(null);
  const [showMenuFor, setShowMenuFor] = React.useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied!");
    setShowMenuFor(null);
  };

  const handleUnsend = async (messageId) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/message/delete/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to unsend message");
      }
      setShowMenuFor(null);
    } catch (error) {
      alert("Something went wrong while unsending.");
      console.error(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-[#EBE8DB] bg-opacity-30">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D76C82] border-t-[#8A0032]"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <p
            className="text-lg font-medium text-[#8A0032] mb-2"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            No Messages Yet
          </p>
          <p className="text-[#3D0301] text-sm md:text-base">
            Start the conversation by sending a message
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {messages.map((message, index) => {
              const isOwn = message.sender._id === user._id;

              return (
                <div
                  key={message._id || index}
                  className={`group flex ${
                    isOwn ? "justify-end" : "justify-start"
                  } relative`}
                  onMouseLeave={() => setShowMenuFor(null)}
                >
                  {!isOwn && (
                    <img
                      src={message.sender.pic}
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full mr-2 self-end border border-[#8A0032] object-cover shadow-sm hidden sm:block"
                    />
                  )}

                  <div className="relative max-w-[85%] sm:max-w-[70%]">
                    <div
                      className={`p-2.5 rounded-lg shadow-sm ${
                        isOwn
                          ? "bg-[#8A0032] text-[#EBE8DB] rounded-tr-none"
                          : "bg-white text-[#3D0301] rounded-tl-none border border-[#D76C82] border-opacity-30"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs text-[#8A0032] font-medium mb-1">
                          {message.sender.name}
                        </p>
                      )}
                      <p className="break-words text-sm md:text-base whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className="text-xs opacity-70 mt-1 block text-right">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {isOwn && (
                      <button
                        onClick={() =>
                          setShowMenuFor(
                            showMenuFor === message._id ? null : message._id
                          )
                        }
                        className="hidden group-hover:flex absolute top-1 -left-6 text-[#EBE8DB] z-10 bg-[#8A0032] bg-opacity-20 p-1 rounded-full cursor-pointer"
                        title="More options"
                      >
                        ⨾
                      </button>
                    )}
                    {showMenuFor === message._id && (
                      <div
                        ref={menuRef}
                        className="absolute bottom-12 left-[-10rem] z-50 w-52 bg-[#1C1C1E] rounded-xl shadow-xl text-white"
                      >
                        {/* Timestamp */}
                        <div className="text-xs text-gray-400 px-4 py-2 border-b border-[#2C2C2E]">
                          {new Date(message.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[#2C2C2E]"
                          onClick={() => handleCopy(message.content)}
                        >
                          <span>Copy</span>
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" />
                          </svg>
                        </button>

                        {/* Unsend */}
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 text-sm text-red-500 hover:bg-[#2C2C2E]"
                          onClick={() => handleUnsend(message._id)}
                        >
                          <span>Unsend</span>
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 5l-7 7 7 7M22 12H4" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typing Indicator */}
          {isTyping && typingUser && (
            <TypingIndicator typingUser={typingUser} />
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;
