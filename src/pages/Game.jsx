import React, { useEffect, useContext } from "react"
import { Divider, Flex, Text, Box, Center, useToast } from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useParams, useNavigate } from "react-router-dom"
import BattleshipBoard from "../components/BattleShipBoard.jsx"
import {
  explosionSound,
  smallSplash,
  sinkShipSound,
} from "../helpers/soundEffects"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket.js"
import AnimationContainer from "../components/AnimationContainer.jsx"

const enemyVariant = {
  hidden: {
    opacity: 0,
    y: "100vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 0.5 },
  },
}

const playerVariant = {
  hidden: {
    opacity: 0,
    y: "-100vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 0.5 },
  },
}

const playerTurnVariants = {
  hidden: { 
    x: '100vw' 
  },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 120 }
  } 
}

const enemyTurnVariants = {
  hidden: { 
    x: '100vw' 
  },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 120 }
  }
}

let socket = null
export default function Game() {
  const { player, setPlayer, handleShoot, user, enemy, handleSunk } =
    useContext(GameContext)
  const { lobbyCode } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    socket = Stomp.client(getDomainWebsocket())
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
      } else {
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
      handleAlerts(`Your ship has been sunk`, "warning")
      handleSunk(player.id, shipId)
    } else {
      handleAlerts(`You have sunk their ship`, "info")
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

  const handleError = (text) => {
    toast({
      title: "Invalid Shot",
      description: text,
        position: "bottom",
        isClosable: true,
        duration: 4000,
        status: "error",
    })
  }

  const handleAlerts = (text, status) => {
    toast({
      title: text,
        position: "bottom",
        isClosable: true,
        duration: 4000,
        status: status,
    })
  }

  return (
    <Flex justifyContent="space-around" width="80%" m="auto">
      <AnimationContainer variants={playerVariant}>
        <Flex direction="column" alignItems="center">
          <Text>{player.name}</Text>
          <BattleshipBoard board={player.board} handleError={handleError}/>
          {player.isMyTurn && <AnimationContainer variants={playerTurnVariants}>Your Turn Captain</AnimationContainer>}
        </Flex>
      </AnimationContainer>

      <Center>
        <Divider orientation="vertical" borderColor="red" border="2px solid" />
      </Center>

      <AnimationContainer variants={enemyVariant}>
        <Flex direction="column" alignItems="center">
          <Text>{enemy.name}</Text>
          <BattleshipBoard
            board={enemy.board}
            handleShoot={shootMissle}
            isTurn={player.isMyTurn}
            isEnemy={true}
            handleError={handleError}
          />
          {!player.isMyTurn && <AnimationContainer variants={enemyTurnVariants}>Enemy Shot Incoming</AnimationContainer>}
        </Flex>
      </AnimationContainer>
    </Flex>
  )
}
