import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chats/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chats/PotentialChats";
import ChatBox from "../components/chats/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatError, updatedCurrentChats } =
    useContext(ChatContext);
  console.log("USER CHATS", userChats);
  return (
    <Container>
      {" "}
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3">
            {isUserChatsLoading && <p>Loading Chats.....</p>}
            {userChats?.map((chat, idx) => {
              return (
                <div key={idx} onClick={() => updatedCurrentChats(chat)}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          {/* <p>Chats</p> */}
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
