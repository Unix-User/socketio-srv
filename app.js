
const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");

const httpServer = createServer({
  key: readFileSync("/etc/letsencrypt/live/your.domain.com/privkey.pem"),
  cert: readFileSync("/etc/letsencrypt/live/your.domain.com/fullchain.pem")
});

const io = new Server(httpServer, {
	cors: {
		origin: "https://your.domain.com"
	}
});

io.on('connection', (socket) => {
  console.log('user ' + socket.id + ' connected');
  socket.on('join-room', (room, id) => {
    socket.broadcast.emit('user-connected', id)
    console.log(socket.id + ' received ' +id + ' peer, joining room: ' + room);
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', id)
      console.log('user ' + socket.id + ' disconnected');
    });
  });
});

httpServer.listen(8888, function(){
	console.log("servidor rodando na porta 8888");
});
