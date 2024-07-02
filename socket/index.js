const { Server } = require("socket.io");

const io = new Server({ cors: "http://192.168.0.159:5173" });
// const io = new Server({ cors: { origin: "https://clever-carrots-attack.loca.lt" } });
let onlineUser = [];
io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  //listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUser.some((user) => user.userId === userId) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
      });
    console.log("Online Users", onlineUser);
    io.emit("getOnlineUsers", onlineUser);
  });
  //add message
  socket.on("sendMessage", (message) => {
    const user = onlineUser.find((user) => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUser);
    console.log("disconnected online users", onlineUser);
  });
});

io.listen(3000);
