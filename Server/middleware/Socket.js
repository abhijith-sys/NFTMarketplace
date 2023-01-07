let ioObj;

const connect = (io) => {
  ioObj = io;
  io.on("connection", (socket) => {
    console.log("New io connection established " + socket.id);

    socket.on("disconnect", () => {
      console.log("io connection closed");
    });

    socket.on("message", (msg) => {
      io.emit("notifyMe/3", msg);
    });
  });
};

const sendAssignNotification = (msg, user_id) => {
  ioObj.emit(
    "notifyMe/" + user_id,
   msg
  );
};





module.exports = { connect, sendAssignNotification };
