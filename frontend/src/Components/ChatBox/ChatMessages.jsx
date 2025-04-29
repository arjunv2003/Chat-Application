import React, { useEffect, useRef } from "react";

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
            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex ${
                  message.sender._id === user._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender._id !== user._id && (
                  <img
                    src={message.sender.pic}
                    alt={message.sender.name}
                    className="w-8 h-8 rounded-full mr-2 self-end border border-[#8A0032] object-cover shadow-sm hidden sm:block"
                  />
                )}
                <div
                  className={`
                    max-w-[85%] sm:max-w-[70%] p-2.5 rounded-lg shadow-sm
                    ${
                      message.sender._id === user._id
                        ? "bg-[#8A0032] text-[#EBE8DB] rounded-tr-none"
                        : "bg-white text-[#3D0301] rounded-tl-none border border-[#D76C82] border-opacity-30"
                    }
                  `}
                >
                  {message.sender._id !== user._id && (
                    <p
                      className="text-xs text-[#8A0032] font-medium mb-1"
                      style={{ fontFamily: "'Underdog', cursive" }}
                    >
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
              </div>
            ))}
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
