import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack, Container, Row, Col, Button } from "react-bootstrap";
import avatatImg from '../../assets/avatar.svg'
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChats, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChats, user);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (textMessage.trim()) {
      sendTextMessage(textMessage, user, currentChats._id, setTextMessage);
      setTextMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation selected yet....
      </p>
    );
  if (isMessagesLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat....</p>
    );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header bg-slate-600 text-2xl text-white">
        <div className="flex items-center gap-3">
          <span className="bg-white w-10 rounded-full shrink-0"><img src={avatatImg} alt="" /></span>
          <div>
            <strong className="leading-none">{recipientUser?.name}</strong>
            <span className="block text-sm opacity-45">11.04.2024</span>
          </div>
        </div>
      </div>
      <Stack gap={3} className="messages" style={{ overflowY: "auto", maxHeight: "400px" }}>
        {messages &&
          messages.map((msg, idx) => (
            <Stack
              key={idx}
              className={`${
                msg.senderId === user._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
            >
              <span style={{fontSize: '16px'}}>{msg.text}</span>
              <span style={{fontSize: '14px', color:'white',opacity: 0.5,marginTop: '5px'}}>{moment(msg.createdAt).calendar()}</span>
            </Stack>
          ))}
        <div ref={messagesEndRef} />
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji className='main_message'
          value={textMessage}
          onChange={setTextMessage}
          onKeyDown={handleKeyPress}  // Use onKeyDown instead of onKeyPress
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn relative"
          onClick={handleSendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
  