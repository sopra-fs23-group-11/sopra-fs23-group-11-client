import React, { useState, useEffect, useContext } from "react"
import { api } from "../../helpers/api.js"
import { Flex } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import AttackBoard from "./AttackBoard.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useParams } from "react-router-dom"

let socket = null
export default function MainGame() {
  const { player, setPlayer, game, setGame, handleShoot, user, lobby, enemy, setEnemy} =
    useContext(GameContext)
  const { lobbyCode } = useParams()
  console.log(player.isMyTurn)
  useEffect(() => {
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected)
  }, [])

  const onConnected = () => {
    socket.subscribe(`/game/${lobbyCode}/${player.id}`, onShotReceived)
  }

  const onShotReceived = (payload) => {
    console.log("shot received")
    const payloadData = JSON.parse(payload.body)
    const position = payloadData.posOfShot

    setPlayer(player => ({
      ...player,
      receivedShots: [...player.receivedShots, position]
    }))

    setPlayer(player => {
      const newBoard = player.board.map((row) =>
          row.map((cell) =>
            player.receivedShots.includes(cell.id)
              ? { ...cell, isShotAt: true }
              : cell
          )
        )

        return { ...player, board: newBoard, isMyTurn: true }
    })

  }

  const shootMissle = (rowIndex, colIndex) => {
    //first render the shot on your own screen on the enemy board
    handleShoot(rowIndex, colIndex)

    //next, send the shot through websocket to render on enemy screen
    const position = player.board[rowIndex][colIndex].id

    setPlayer(player => ({...player, isMyTurn: false}))
 
    const shot = {
      attackerId: player.id,
      defenderId: enemy.id,
      posOfShot: position,
      gameId: lobbyCode,
    }
    if (socket) {
      socket.send("/app/game", {}, JSON.stringify(shot))
    }
  }

  return (
    <div>
      <>
      <h2>Player1: {user.isHost ? player.name : enemy.name}</h2>
        <h2>Player2: {user.isHost ? enemy.name : player.name}</h2>
        <h3>
          {player.isMyTurn ? "Your Turn to Shoot": "Enemy Shot Incoming!" }
        </h3>
      </>
      <Flex>
        {user.isHost ? 
        <>
        <AttackBoard
          board={player.board}
          playerId={player.id}
        />

        <AttackBoard
          board={enemy.board}
          handleShoot={shootMissle}
          playerId={player.id}
          isTurn= {player.isMyTurn}
        />
        </>
        : 
        <>
           <AttackBoard
          board={enemy.board}
          handleShoot={shootMissle}
          playerId={player.id}
          isTurn= {player.isMyTurn}
        />

          <AttackBoard
          board={player.board}
          playerId={player.id}
        />
        </>
      }
      </Flex>
    </div>
  )
}
