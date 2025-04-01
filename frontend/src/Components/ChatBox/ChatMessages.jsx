import React, { useEffect, useRef } from "react";

const TypingIndicator = ({ typingUser }) => (
  <div className="typing-indicator flex items-center mb-2">
    <img
      src={typingUser.pic}
      alt={typingUser.name}
      className="w-8 h-8 rounded-full mr-2"
    />
    <div className="bg-gray-200 p-2 rounded-lg flex items-center">
      <span className="mr-2">{typingUser.name} is typing</span>
      <div className="dots inline-flex">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
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
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {loading ? (
        <div className="text-center">Loading messages...</div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`flex ${
                message.sender._id === user._id
                  ? "justify-end"
                  : "justify-start"
              } mb-2`}
            >
              <div
                className={`
                  max-w-[70%] p-2 rounded-lg 
                  ${
                    message.sender._id === user._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }
                `}
              >
                {message.content}
              </div>
            </div>
          ))}

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
