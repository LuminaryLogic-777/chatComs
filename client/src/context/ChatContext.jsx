import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, postReq, getReq } from "../utils/Services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChats, setCurrentChats] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setSendTextMessasgeError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // console.log("Current Chats", currentChats);
  // console.log("Messages", messages);
  // console.log("Online Users", onlineUsers);
  console.log("Notificationss", notifications);

  useEffect(() => {
    const newSocket = io("http://192.168.0.159:3000");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  //add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send messages to the server
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChats?.members.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //recieve messages & notifications from the server
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChats?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChats?.members.some(
        (id) => id === res.senderId
      );
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
      console.log("Updated notifications:", notifications);
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChats]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await getReq(`${baseUrl}/users`);
      console.log("aafadad", res);
      if (res.error) {
        return console.log(res);
      }

      const pChats = res.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      console.log("PPCHATS", pChats);
      setPotentialChats(pChats);
      setAllUsers(res);
    };

    getUsers();
  }, [userChats]);
  console.log("Potentialsss CHatsss", potentialChats);
  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);

      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatError(null);
        const res = await getReq(`${baseUrl}/chats/${user?._id}`);
        console.log("geUserChatss", res);
        setIsUserChatsLoading(false);
        if (res.error) {
          return setUserChatError(res);
        }
        setUserChats(res);
      }
    };
    getUserChats();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessageError(null);
      const res = await getReq(`${baseUrl}/messages/${currentChats?._id}`);
      console.log("geUserChatss", res);
      setIsMessagesLoading(false);
      if (res.error) {
        return setMessageError(res);
      }
      setMessages(res);
    };
    getMessages();
  }, [currentChats]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("you must type something...");

      const res = await postReq(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (res.error) {
        return setSendTextMessasgeError(res);
      }
      setNewMessage(res);
      setMessages((prev) => [...prev, res]);
      setTextMessage("");
    },
    []
  );

  const updatedCurrentChats = useCallback((chats) => {
    setCurrentChats(chats);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const res = await postReq(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (res.error) {
      return console.log("Error creating chat", res);
    }
    setUserChats((prev) => [...prev, res]);
  }, []);

  const markAllNotificationsRead = useCallback(async (notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    async (n, userChats, user, notifications) => {
      const desireChats=userChats.find(chat=>{
        const chatMembers=[user._id,n.senderId];
        const isDesiredChat=chat?.members.every((member)=>{
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });
      //mark notification as read
      const mNotifications=notifications.map(el=>{
        if(n.senderId===el.senderId){
          return {...n, isRead:true}
        }else{
          return el;
        }
      })
      updatedCurrentChats(desireChats);
      setNotifications(mNotifications);
    },[]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        setUserChats,
        setIsUserChatsLoading,
        setUserChatError,
        potentialChats,
        createChat,
        updatedCurrentChats,
        currentChats,
        messages,
        isMessagesLoading,
        messageError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
