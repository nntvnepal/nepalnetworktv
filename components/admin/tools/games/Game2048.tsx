"use client"

import { useState, useEffect } from "react"
import ToolsCard from "../ToolsCard"

function getEmptyBoard() {
  const board = Array(4).fill(0).map(()=>Array(4).fill(0))
  addRandom(board)
  addRandom(board)
  return board
}

function addRandom(board:any){
  const empty = []
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(board[i][j]===0) empty.push([i,j])
    }
  }
  if(empty.length===0) return
  const [i,j] = empty[Math.floor(Math.random()*empty.length)]
  board[i][j]=Math.random()>0.5?2:4
}

export default function Game2048(){

  const [board,setBoard]=useState(getEmptyBoard())

  function moveLeft(){
    const newBoard = board.map(row=>{
      let arr=row.filter(x=>x)
      for(let i=0;i<arr.length-1;i++){
        if(arr[i]===arr[i+1]){
          arr[i]*=2
          arr[i+1]=0
        }
      }
      arr=arr.filter(x=>x)
      while(arr.length<4) arr.push(0)
      return arr
    })
    addRandom(newBoard)
    setBoard([...newBoard])
  }

  useEffect(()=>{
    const handle=(e:any)=>{
      if(e.key==="ArrowLeft") moveLeft()
    }
    window.addEventListener("keydown",handle)
    return ()=>window.removeEventListener("keydown",handle)
  },[board])

  return(
    <ToolsCard title="2048">

      <div className="grid grid-cols-4 gap-2">
        {board.flat().map((n,i)=>(
          <div key={i}
            className="h-16 flex items-center justify-center bg-black/60 text-white">
            {n!==0?n:""}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Use ← arrow key
      </p>

    </ToolsCard>
  )
}