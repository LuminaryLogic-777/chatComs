// import React, { useContext, useState, useEffect } from "react";
// import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
// import { Stack } from "react-bootstrap";
// import avatar from "../../assets/avatar.svg";
// import { ChatContext } from "../../context/ChatContext";

// const UserChat = ({ chat, user }) => {
//   const { recipientUser } = useFetchRecipientUser(chat, user);
//   const { onlineUsers, notifications } = useContext(ChatContext);
//   const [unreadCount, setUnreadCount] = useState(0);



//   useEffect(() => {
//     const unreadNotifications = notifications.filter(
//       (notification) =>
//         notification.senderId === recipientUser?._id && !notification.isRead
//     );
//     setUnreadCount(unreadNotifications.length);
//   }, [notifications, recipientUser]);




//   // Function to truncate text and add ellipsis
 
//   console.log("RECIPIENT USER", recipientUser?.name);
//   const isOnline = onlineUsers?.some(
//     (onlineUser) => onlineUser?.userId === recipientUser?._id
//   );

//   return (
//     <Stack
//       direction="horizontal"
//       gap={3}
//       className="user-card align-items-center p-2 justify-content-between"
//       role="button"
//     >
//       <div className="d-flex">
//         <div className="me-2 w-16 relative bg-slate-200 rounded-full">
//           <img src={avatar} alt="avatar" height="35" />
//           <span className={isOnline ? "user-online" : ""}></span>
//         </div>
//         <div className="text-content">
//           <div className="name text-lg capitalize">{recipientUser?.name}</div>
//           <div className="text">Text Message</div>
//         </div>
//       </div>
//       <div className="d-flex flex-column align-items-end">
//         <div className="date text-sm">12/06/2024</div>
//         {unreadCount > 0 && (
//           <div className="this-user-notifications text-white">
//             {unreadCount}
//           </div>
//         )}
//       </div>
//     </Stack>
//   );
// };

// export default UserChat;



import React, { useContext, useState, useEffect } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationFunc } from "../../utils/unreadNotification";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications } = useContext(ChatContext);
  const [unreadCount, setUnreadCount] = useState(0);

  // useEffect(() => {
  //   if (recipientUser) {
  //     const storedUnreadCount = localStorage.getItem(`unreadCount_${recipientUser._id}`);
  //     if (storedUnreadCount) {
  //       setUnreadCount(parseInt(storedUnreadCount, 10));
  //     }
  //   }
  // }, [recipientUser]);

  // useEffect(() => {
  //   if (recipientUser) {
  //     const unreadNotifications = notifications.filter(
  //       (notification) =>
  //         notification.senderId === recipientUser._id && !notification.isRead
  //     );
  //     const newUnreadCount = unreadNotifications.length;
  //     setUnreadCount(newUnreadCount);
  //   }
  // // }, [notifications, recipientUser]);
  // const handleChatClick = () => {
  //   if (recipientUser) {
  //     const updatedNotifications = notifications.map((notification) =>
  //       notification.senderId === recipientUser._id
  //         ? { ...notification, isRead: true }
  //         : notification
  //     );

  //     localStorage.setItem(`unreadCount_${recipientUser._id}`, '0');
  //     setUnreadCount(0);
  //   }
  // };

  const unreadNotifications=unreadNotificationFunc(notifications);

  const thisUserNotifications= unreadNotifications.filter(
    n=>n.senderId === recipientUser._id
  )
  

  const isOnline = onlineUsers.some(
    (onlineUser) => onlineUser.userId === recipientUser?._id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      // onClick={handleChatClick}
    >
      <div className="d-flex">
        <div className="me-2 w-16 relative bg-slate-200 rounded-full">
          <img src={avatar} alt="avatar" height="35" />
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
        <div className="text-content">
          <div className="name text-lg capitalize">{recipientUser?.name}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date text-sm">12/06/2024</div>
        {thisUserNotifications?.length > 0 && (
          <div className="this-user-notifications text-white">
            {thisUserNotifications?.length}
          </div>
        )}
      </div>
    </Stack>
  );
};

export default UserChat;
 


