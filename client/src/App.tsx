import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import board from './svgs/Board.svg';
import Piao from './svgs/Piao';
import Board from './svgs/Board'
import './App.css';
import Game from './Game'
import { io } from 'socket.io-client'
// const socket = io('ws://localhost:3131')

const socket = io()

function App(props:any) {
  const [roomInput, setRoomInput] = useState('')
  const [room, setRoom] = useState('--')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([] as string[])
  function joinRoom(){
    console.log("LS -> src/App.tsx:19 -> roomId: ", roomInput)
    socket.emit('leaveRoom',room)
    socket.emit('joinRoom',roomInput)
    setRoom(roomInput)
    setMessages([])

  }

  function sendMessage(){
    socket.emit('message',{room:roomInput,message})
    setMessages([...messages,message])


  }

  useEffect(()=>{
    function messageHandler (msg:string){
      console.log('message received here!!', msg)
      messages.push(msg) 
      setMessages([...messages])
      console.log("LS -> src/App.tsx:38 -> messages: ", messages)
    }
    socket.on('message',messageHandler)
    return ()=>{socket.off('message', messageHandler)}
  }, [messages])


  return (
    <div className="App">
      <div className="App-header">
          <h3>WhatsApp 2</h3>
          <h3>Room: <i>{room}</i></h3>
        <input value={roomInput} onChange={e=>setRoomInput(e.target.value)} placeholder="#92839283"></input>
        <button onClick={joinRoom}> Join Room </button>

        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="#92839283"></input>
        <button onClick={sendMessage}> Send Message </button>

    <ul>
            {messages.map((m,i)=><li key={i}>{m}</li>)}
          </ul>
      </div>
    </div>
  );
}

export default App;
