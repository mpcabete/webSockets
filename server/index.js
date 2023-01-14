"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
app.use(cors());
app.use(express.static('../chess/build'));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});
// app.get('/', (req:any, res:any) => {
//   res.sendFile(__dirname + '/index.html');
// });
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('roll', (data) => {
        console.log('roll', socket.id, data);
        socket.broadcast.emit('update', { user: socket.id, i: data.i });
    });
});
server.listen(3131, () => {
    console.log('listening on *:3000');
});
