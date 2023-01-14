"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
function randomDigit() {
    return Math.floor(Math.random() * 36).toString(36);
}
app.use(cors());
app.use(express.static('../client/build'));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});
// app.get('/', (req:any, res:any) => {
//   res.sendFile(__dirname + '/index.html');
// });
const rooms = {};
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('createRoom', (data) => {
        console.log('Creating room for:', socket.id, data);
        const roomId = new Array(5).fill('').map(() => randomDigit()).join('');
        rooms[roomId] = { users: [] };
        socket.join(roomId);
        // socket.broadcast.emit('update',{user:socket.id,i:data.i})
    });
    socket.on('joinRoom', room => {
        console.log(socket.id, 'joining', room);
        socket.join(room);
    });
    socket.on('leaveRoom', room => {
        console.log(socket.id, 'joining', room);
        socket.leave(room);
    });
    socket.on('message', data => {
        const { room, message } = data;
        console.log(room, 'message received', message);
        socket.to(room).emit('message', message);
    });
    socket.on('roll', (data) => {
        console.log('roll', socket.id, data);
        socket.broadcast.emit('update', { user: socket.id, i: data.i });
    });
});
const port = 3131;
server.listen(port, () => {
    console.log('listening on port' + port);
});
