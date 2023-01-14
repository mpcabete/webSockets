import { Socket } from "socket.io";

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors')

app.use(cors())
app.use(express.static(__dirname+'../client/build'))



const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000"
  }
});

// app.get('/', (req:any, res:any) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket:Socket) => {
  console.log('a user connected',socket.id);
  socket.on('roll', (data:any)=>{
    console.log('roll',socket.id,data)
    socket.broadcast.emit('update',{user:socket.id,i:data.i})
  })
});

const port = 3131
server.listen(port, () => {
  console.log('listening on port'+port);
});
