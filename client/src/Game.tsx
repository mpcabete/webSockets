import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import board from './svgs/Board.svg';
import Piao from './svgs/Piao';
import Board from './svgs/Board'
import './App.css';
import { io } from 'socket.io-client'
const socket = io('ws://localhost:3131')
// const socket = io()
export class Tile{
  center
  position ?: number
  constructor(public element:Element){
    const position = element.getBoundingClientRect()
    this.center = {
      x:position.x + position.width/2,
      y:position.y + position.height/2
    }

  }
}

function Game() {
  const [tiles,setTiles] = useState( [] as Tile[] )

  function roll(){
    const dice = Math.floor(Math.random()*6)+1
    console.log("LS -> src/App.tsx:21 -> dice: ", dice)
    const i = (p1+dice)%32
    socket.emit("roll",{i})
    setP1(i)
  }

  const boardRef = useRef(null) as MutableRefObject<SVGElement|null>
  useEffect(()=>{
    const type = boardRef.current?.tagName
    if(type==='svg'){
      const board = boardRef as MutableRefObject<SVGElement>
      const tiles = Array.from(board.current.querySelectorAll('.tile')).map(t=>new Tile(t))
      const sortedTiles = tiles.sort((a,b)=>a.center.x-b.center.x)
      const first = sortedTiles.shift()

      const last = sortedTiles.pop()
      if(!first)return
      const up = sortedTiles.filter(t=>t.center.y<first.center.y)
      const down = sortedTiles.filter(t=>t.center.y>first.center.y)
      const orderedTiles = [first,...up,last,...down.reverse()] as Tile[]
      orderedTiles.forEach((x,i)=>x.position = i)
      setTiles(orderedTiles)

    socket.on('update',(data)=>{
      console.log('update',data)
      setP2(data.i)
    })
    }else{console.error('ref not svg')}

  }, [boardRef])

  const [p1,setP1] = useState(0)
  const [p2,setP2] = useState(0)

  return (
    <div className="App">
      <div className="App-header">
      <button onClick={roll}>roll</button>
        <Board boardRef={boardRef}/>
        <Piao player='0' tileI={p1} tiles={tiles} />
        <Piao player='1' tileI={p2} tiles={tiles} />

      </div>
    </div>
  );
}

export default Game;
