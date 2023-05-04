import React, { useState, useEffect, useContext } from "react"
import { api } from "../../helpers/api.js"
import { Flex } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import AttackBoard from "./AttackBoard.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useParams } from "react-router-dom"

let socket = null
export default function MainGame() {
  const { playerOne, playerTwo, handleShoot, setPlayerOne, setPlayerTwo } =
    useContext(GameContext)
  const { lobbyCode } = useParams()

  useEffect(() => {
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected)
  }, [])

  const onConnected = () => {
    socket.subscribe(`/game/${lobbyCode}`, onShotReceived)
  }

  const onShotReceived = (payload) => {
    console.log("shot received")
    const payloadData = JSON.parse(payload.body)
    const position = payloadData.posOfShot
    // const arr = position.split("")
    // const x = arr[0].charCodeAt(0)- 65
    // const y = parseInt(arr[1]) - 1
    const defender = payloadData.defenderId
    if (defender === playerOne.playerId) {
      setPlayerOne((prevState) => ({
        ...prevState,
        receivedShots: [...prevState.receivedShots, position],
      }))

      setPlayerOne((prevState) => {
        const newBoard = prevState.playerBoard.map((row) =>
          row.map((cell) =>
            prevState.receivedShots.includes(cell.id)
              ? { ...cell, isShotAt: true }
              : cell
          )
        )

        return { ...prevState, playerBoard: newBoard }
      })
    } else {
      setPlayerTwo((prevState) => ({
        ...prevState,
        receivedShots: [...prevState.receivedShots, position],
      }))
      setPlayerTwo((prevState) => {
        const newBoard = prevState.playerBoard.map((row) =>
          row.map((cell) =>
            prevState.receivedShots.includes(cell.id)
              ? { ...cell, isShotAt: true }
              : cell
          )
        )

        return { ...prevState, playerBoard: newBoard }
      })
    }
  }

  const shootMissle = (id, rowIndex, colIndex) => {
    //first render the shot on your own screen on the enemy board
    handleShoot(id, rowIndex, colIndex)

    //next, send the shot through websocket to render on enemy screen
    const position = playerOne.playerBoard[rowIndex][colIndex].id
    let attack
    let defend

    if (id === playerOne.playerId) {
      attack = playerOne.playerId
      defend = playerTwo.playerId
    } else {
      attack = playerTwo.playerId
      defend = playerOne.playerId
    }
    const shot = {
      attackerId: attack,
      defenderId: defend,
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
        <h2>Player1 ID: {playerOne.playerId}</h2>
        <h2>Player1 Name: {playerOne.playerName}</h2>
        <h2>Player2 ID: {playerTwo.playerId}</h2>
        <h2>Player2 Name: {playerTwo.playerName}</h2>
      </>
      <Flex>
        <AttackBoard
          socket={socket}
          board={playerOne.playerBoard}
          handleShoot={shootMissle}
          playerId={playerTwo.playerId}
        />
        <AttackBoard
          socket={socket}
          board={playerTwo.playerBoard}
          handleShoot={shootMissle}
          playerId={playerOne.playerId}
        />
      </Flex>
    </div>
  )
}
