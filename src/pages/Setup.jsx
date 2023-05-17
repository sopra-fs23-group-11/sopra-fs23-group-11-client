import React, { useContext, useEffect, useState, useRef } from "react"
import BattleshipBoard from "../components/BattleShipBoard.jsx"
import Ship from "../components/Ship.jsx"
import { api } from "../helpers/api.js"
import AnimationContainer from "../components/AnimationContainer.jsx"
import EnemyExitModal from "../components/EnemyExitModal.jsx"

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
  useToast, IconButton, Collapse,
} from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket.js"

import { Alert, AlertIcon, Stack } from "@chakra-ui/react"

import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {InfoIcon} from "@chakra-ui/icons";

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
  const [enemyExit, setEnemyExit] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const { lobbyCode } = useParams()
  const navigate = useNavigate()
  const hostId = lobby?.hostId

  useEffect(() => {
    console.log("effect ran...")
    socket = Stomp.client(getDomainWebsocket())
    socket.connect({}, onConnected, errorCallback)

    if (player.isReady && enemy.isReady) navigate(`/game/${lobbyCode}`)
  }, [enemy.isReady, player.isReady])


  const errorCallback = (m) => {
    console.log("mmm", m)
  }

  const onConnected = () => {
    console.log("Stomp client connected !", lobbyCode)
    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    console.log("websocket connected!")
    socket.subscribe(
      `/ready/${user.id === lobby?.hostId ? lobby?.joinerName : lobby?.hostName}`,
      onReady
    )
    console.log("user.id", user.id, "lobby.hostId", lobby.hostId,
        "joinerName", lobby.joinerName, "hostName", lobby.hostName)
    console.log(user.id)
    socket.subscribe(`/game/${lobbyCode}/leave`, onLeave)
  }

  async function startGame() {
    try {
      await api.post(`/startgame`, JSON.stringify({ lobbyCode, hostId }))
    } catch (error) {
      console.log("server error",error.message)
      console.log(hostId)
      console.log(lobbyCode)
      console.log(user.id)
      console.log(lobby.hostName)
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
    setEnemyExit(true)
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
  const toggleRules = () => {
    setShowRules(!showRules)
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" h="70vh">
      {isStartSetup ? (
        <Flex justifyContent="center" alignItems="center" position="relative">
          <IconButton
              aria-label="Show Rules"
              icon={<InfoIcon />}
              position="absolute"
              top="1rem"
              right="1rem"
              onClick={toggleRules}
              variant="ghost"
          />
          <AnimationContainer variants={boardVariant}>
            <BattleshipBoard
              board={player.board}
              handlePlace={placeShip}
              isSetUp={true}
              direction={direction}
            />
          </AnimationContainer>
          <Flex direction="column" minW="300px" justifyContent="center">
            <AnimationContainer variants={shipsVariant}>
              {player.ships.length !== 0 && (
                <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
                  Place your ships
                </h2>
              )}
              <Flex direction="column" minH="400px">
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
                {player.ships.length !== 0 && (
                  <>
                    <FormLabel fontSize="20px" htmlFor="direction">
                      {direction}
                    </FormLabel>
                    <Switch id="direction" mb={10} onChange={handleToggle} />
                  </>
                )}
              </Flex>
            </AnimationContainer>

            {player.ships.length === 0 && (
              <AnimationContainer variants={readyVariants}>
                <Button
                  onClick={playerReady}
                  isLoading={waitingSpinner}
                  spinnerPlacement="start"
                  loadingText="Good Luck Captain 🫡"
                  alignSelf="center"
                  variant="brand"
                >
                  Ready
                </Button>
              </AnimationContainer>
            )}
          </Flex>
          <Collapse in={showRules}>
            <Text fontSize="sm" color="gray.500" textAlign="left">
              <Text as="b">Set-up: </Text><br />
              Select the ship you want to place and hover over the field to see its arrangement. <br />
              Click on the field to place the ship, but keep in mind that once a ship is placed, you cannot undo it!<br/>
              Your ships can touch each other, but they cannot overlap.<br/>
              Use the button to switch between horizontal and vertical placement of the ships.<br/>
              Make sure to place all your ships before starting the game.  <br/>
              Good Luck, Captain!<br />
            </Text>
          </Collapse>
        </Flex>
      ) : user.isHost ? (
        <Button onClick={startGame} alignSelf="center" size="lg" variant="brand">
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
      {enemyExit && <EnemyExitModal enemyExit={enemyExit}/>}
    </Box>
  )
}
export default Setup
