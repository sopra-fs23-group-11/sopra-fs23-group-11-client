import React, { useState, useEffect, useContext } from "react"
import { api } from "../../helpers/api.js"
import { Flex } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import AttackBoard from "./AttackBoard.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useParams } from "react-router-dom"

let socket = null
export default function MainGame() {
  const {host, playerOne, playerTwo, handleShoot, joiner, handleAttack} = useContext(GameContext)
  const {lobbyCode} = useParams()


  useEffect(() => {
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected,)
    
  },[])

  const onConnected = () => {
    socket.subscribe(`/game/${lobbyCode}`, onShotReceived )
  }

  const onShotReceived = (payload) => {
    const payloadData = JSON.parse(payload.body)
    const position = payloadData.posOfShot
    const arr = position.split("")
    const x = arr[0].charCodeAt(0)- 65
    const y = parseInt(arr[1]) - 1
    const defender = payloadData.defenderId
    handleAttack(x, y, defender)

  }

const shootMissle = (id, rowIndex, colIndex) => {
    const position = playerOne.playerBoard[rowIndex][colIndex].id
    let attack
    let defend

    if(id === playerOne.playerId){
        attack = playerOne.playerId
        defend = playerTwo.playerId
    }else{
        attack = playerTwo.playerId
        defend = playerOne.playerId
    }
    const shot = {
        attackerId: attack,
        defenderId: defend,
        posOfShot: position,
        gameId: lobbyCode
    }
    if (socket){
        socket.send("/app/game", {}, JSON.stringify(shot))
    }
    handleShoot(id, rowIndex, colIndex)
  }
  
  return (
    <div>
        <>
        <h2>Host ID: {host.hostId}</h2>
        <h2>Host Name: {host.hostName}</h2>
        <h2>Joiner ID: {joiner.joinerId}</h2>
        <h2>Joiner Name: {joiner.joinerName}</h2>
      </>
        <Flex>
            <AttackBoard
            socket={socket}
            board={playerOne.playerBoard}
            handleShoot={shootMissle}
            playerId ={playerTwo.playerId}
            />
            <AttackBoard
            socket={socket}
            board={playerTwo.playerBoard}
            handleShoot={shootMissle}
            playerId ={playerOne.playerId}
            />
        </Flex>
    </div>
  )
}
