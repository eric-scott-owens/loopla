const express = require("express");
const path = require('path');
const socketIo = require("socket.io");
const EVENTS = require("./SOCKET_IO_EVENTS.js");

const PORT = process.env.PORT || process.env.LOOPLA_SOCKET_IO_SERVER_PORT || 4001;
const INDEX = path.join(__dirname, 'index.html');

function log(message) {
  // eslint-disable-next-line
  console.log(message);
}


const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => log(`Listening on ${ PORT }`));

  const io = socketIo(server); // < Interesting!

const post_namespace = io
  .of('/posts')
  .on("connection", socket => {
    log("New client connected");

    socket.on(EVENTS.posts.joinLoopRoom, (selectedLoopId) => {
      socket.join(selectedLoopId);
      log(`Client joined ${selectedLoopId}`);
    });

    socket.on(EVENTS.posts.leaveLoopRoom, (selectedLoopId) => {
      socket.leave(selectedLoopId);
      log(`Client left ${selectedLoopId}`);
    });

    socket.on(EVENTS.posts.dataReceived, (post) => {
      log(`Sending post ${post.id} to ${post.group}`);
      socket.to(post.group).emit(EVENTS.posts.dataReceived, post);
    });

    socket.on(EVENTS.posts.dataRemoved, (post) => {
      log(`Removing post ${post.id} from ${post.group}`);
      socket.to(post.group).emit(EVENTS.posts.dataRemoved, post);
    });

    socket.on("disconnect", () => log("Client disconnected"));
  });
