import React, { useContext, useEffect, useState, useRef } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ship from "../../components/Ship.jsx"
import { api } from "../../helpers/api.js"
import AnimationContainer from "../../components/AnimationContainer.jsx"

import {
  Flex,
  Button,
  Box,
  Text,
  Spinner,
  Grid,
  GridItem,
  Switch,
  FormLabel,
} from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"
import { getDomainWebsocket } from "../../helpers/getDomainWebsocket.js"

import { Alert, AlertIcon, Stack } from "@chakra-ui/react"

import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const shipsVariant = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.7, stiffness: 50 },
  },
}

const boardVariant = {
  hidden: {
    opacity: 0,
    x: "-100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.4, stiffness: 50 },
  },
}

const readyVariants = {
  hidden: {
    y: "-100vh",
  },
  visible: {
    y: 0,
    transition: { stiffness: 120, type: "spring" },
  },
}
let socket = null
function Setup() {
  const {
    user,
    player,
    setPlayer,
    lobby,
    direction,
    setDirection,
    errorLogs,
    handleSelect,
    handlePlace,
    setEnemy,
    enemy,
    resetState,
  } = useContext(GameContext)

  const [isStartSetup, setIsStartSetup] = useState(false)
  const [waitingSpinner, setWaitingSpinner] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { lobbyCode } = useParams()
  const navigate = useNavigate()
  const hostId = lobby.hostId

  useEffect(() => {
    console.log("effect ran...")
    socket = Stomp.client(getDomainWebsocket())
    socket.connect({}, onConnected, errorCallback)

    if (player.isReady && enemy.isReady) navigate(`/game/${lobbyCode}`)
  }, [enemy.isReady, player.isReady])

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault()
  //     event.returnValue = ""
  //   }
  //   window.addEventListener("popstate", handleBeforeUnload)

  //   return () => {
  //     if(isConnected){
  //       socket.send(`/app/leave`, {}, JSON.stringify(user.name))
  //       window.removeEventListener("popstate", handleBeforeUnload)
  //       socket.disconnect()
  //     }
  //   }
  // }, [isConnected])

  const errorCallback = (m) => {
    console.log("mmm", m)
  }

  const onConnected = () => {
    console.log("Stomp client connected !", lobbyCode)
    setIsConnected(true)
    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    console.log("websocket connected!")
    socket.subscribe(
      `/ready/${user.id === lobby.hostId ? lobby.joinerName : lobby.hostName}`,
      onReady
    )
    socket.subscribe(`/leave/${lobbyCode}`, onLeave)
  }

  async function startGame() {
    try {
      await api.post(`/startgame`, JSON.stringify({ lobbyCode, hostId }))
    } catch (error) {
      console.log(error.message)
    }
  }

  function playerReady() {
    setPlayer((player) => ({ ...player, isReady: true }))

    const readyMessage = {
      gameId: lobbyCode,
      playerId: player.id,
      playerName: player.name,
      playerBoard: JSON.stringify(player.board),
    }
    setWaitingSpinner(true)
    socket.send(`/app/ready`, {}, JSON.stringify(readyMessage))
  }

  const onStartGame = (payload) => {
    console.log("game starts")
    const payloadData = JSON.parse(payload.body)
    console.log("game starts")
    if (user.isHost) {
      setPlayer((player) => ({
        ...player,
        id: payloadData.player1Id,
        name: payloadData.player1Name,
        isMyTurn: true,
      }))

      setEnemy((enemy) => ({
        ...enemy,
        id: payloadData.player2Id,
        name: payloadData.player2Name,
      }))
    } else {
      setPlayer((player) => ({
        ...player,
        id: payloadData.player2Id,
        name: payloadData.player2Name,
      }))
      setEnemy((enemy) => ({
        ...enemy,
        id: payloadData.player1Id,
        name: payloadData.player1Name,
      }))
    }

    setIsStartSetup(true)
  }

  const onReady = (payload) => {
    console.log("game starts on Ready")
    const payloadData = JSON.parse(payload.body)
    setEnemy((enemy) => ({
      ...enemy,
      isReady: true,
      board: JSON.parse(payloadData.playerBoard),
    }))
  }

  const onLeave = () => {
    console.log("player left the game")
  }

  //the following functions delegate to the functions from GameContext
  const selectShip = (shipId) => {
    handleSelect(shipId)
  }

  const placeShip = (rowIndex, colIndex) => {
    handlePlace(rowIndex, colIndex)
  }

  const handleToggle = () => {
    setDirection(direction === "Horizontal" ? "Vertical" : "Horizontal")
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" h="70vh">
      <>
        {/* <h2>Player1: {user.isHost ? player.name : enemy.name}</h2>
        <h2>Player2: {user.isHost ? enemy.name : player.name}</h2>
        <h2>
          {" "}
          Click the button on the right to make your ship vertical or horizontal
        </h2> */}
        {errorLogs.length > 0 && <h3> Following error in placements:</h3>}
        {errorLogs.length > 0 && (
          <Stack spacing={3}>
            {errorLogs.map((error) => {
              return (
                <Alert status="error" key={error}>
                  <AlertIcon />
                  {error}
                </Alert>
              )
            })}
          </Stack>
        )}
      </>
      {isStartSetup ? (
        <Flex justifyContent="center">
          <AnimationContainer variants={boardVariant}>
            <BattleshipBoard
              board={player.board}
              handlePlace={placeShip}
              isSetUp={true}
            />
          </AnimationContainer>
          <Flex direction="column" minW="250px">
            <AnimationContainer variants={shipsVariant}>
              {player.ships.length !== 0 && (
                <>
                  <FormLabel htmlFor="direction">{direction}</FormLabel>
                  <Switch id="direction" onChange={handleToggle} />
                </>
              )}
              {player.ships.map((ship) => (
                <Ship
                  key={ship.id}
                  type={ship.type}
                  length={ship.length}
                  isHeld={ship.isHeld}
                  handleSelect={selectShip}
                  playerId={player.id}
                  shipId={ship.id}
                />
              ))}
            </AnimationContainer>

            {player.ships.length === 0 && (
              <AnimationContainer variants={readyVariants}>
                <Button
                  onClick={playerReady}
                  isLoading={waitingSpinner}
                  spinnerPlacement="start"
                  loadingText="Good Luck Captain 🫡"
                  alignSelf="center"
                >
                  Ready
                </Button>
              </AnimationContainer>
            )}
          </Flex>
        </Flex>
      ) : user.isHost ? (
        <Button onClick={startGame} alignSelf="center">
          Start Setup
        </Button>
      ) : (
        <Flex
          justifyContent="center"
          alignItems="center"
          h="70vh"
          direction={"column"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="lg"
          />
          <Text textAlign={"center"}>
            Please Wait, Host is putting on his socks...
          </Text>
        </Flex>
      )}
    </Box>
  )
}
export default Setup
