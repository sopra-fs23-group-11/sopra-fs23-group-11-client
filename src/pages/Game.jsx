import React, { useEffect, useContext } from "react"
import { Flex } from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useParams, useNavigate} from "react-router-dom"
import BattleshipBoard from "../components/BattleShipBoard.jsx"
import { explosionSound, smallSplash, sinkShipSound} from "../helpers/soundEffects"

let socket = null
export default function Game() {
  const { player, setPlayer, handleShoot, user, enemy, handleSunk } =
    useContext(GameContext)
  const { lobbyCode } = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected)
  }, [])

  const onConnected = () => {
    socket.subscribe(`/game/${lobbyCode}/${player.id}`, onShotReceived)
    socket.subscribe(`/game/${lobbyCode}/sunk`, onSunkenShip)
    socket.subscribe(`/game/${lobbyCode}/finish`, onFinished)
  }

  const onShotReceived = (payload) => {
    console.log("shot received")
    const payloadData = JSON.parse(payload.body)
    const position = payloadData.posOfShot
    const isAHit = payloadData.hit

    setPlayer((player) =>
      isAHit
        ? { ...player, hitsReceived: [...player.hitsReceived, position] }
        : { ...player, missesReceived: [...player.missesReceived, position] }
    )

    setPlayer((player) => {
      const newBoard = player.board.map((row) =>
        row.map((cell) =>
          player.hitsReceived.includes(cell.id)
            ? { ...cell, isHit: true }
            : player.missesReceived.includes(cell.id)
            ? { ...cell, isShotAt: true }
            : cell
        )
      )
      if (isAHit) {
        explosionSound()
      }else {
        smallSplash()
      }
      return { ...player, board: newBoard, isMyTurn: true }
    })
  }
  const onFinished = (payload) => {
    const payloadData = JSON.parse(payload.body)
    navigate(`/endscreen/${lobbyCode}`)
  }


  const onSunkenShip = (payload) => {
    sinkShipSound()
    const payloadData = JSON.parse(payload.body)
    const shipType = payloadData.shipType
    const shipId = payloadData.shipId
    console.log(payloadData)
    if (payloadData.defenderId === player.id) {
      alert(`Your ${shipType} has been sunk`)
      handleSunk(player.id,shipId )
    } else {
      alert(`You have sunk their ${shipType}`)
      handleSunk(enemy.id, shipId)
    }

  }

  const shootMissle = (rowIndex, colIndex) => {
    //first render the shot on your own screen on the enemy board
    handleShoot(rowIndex, colIndex)

    //next, send the shot through websocket to render on enemy screen
    const position = player.board[rowIndex][colIndex].id

    setPlayer((player) => ({ ...player, isMyTurn: false }))

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
          {player.isMyTurn ? "Your Turn to Shoot" : "Enemy Shot Incoming!"}
        </h3>
      </>
      <Flex>
        {user.isHost ? (
          <>
            <BattleshipBoard board={player.board}/>

            <BattleshipBoard
              board={enemy.board}
              handleShoot={shootMissle}
              isTurn={player.isMyTurn}
              isEnemy={true}
            />
          </>
        ) : (
          <>
            <BattleshipBoard
              board={enemy.board}
              handleShoot={shootMissle}
              isTurn={player.isMyTurn}
              isEnemy={true}
            />

            <BattleshipBoard board={player.board}/>
          </>
        )}
      </Flex>
    </div>
  )
}
