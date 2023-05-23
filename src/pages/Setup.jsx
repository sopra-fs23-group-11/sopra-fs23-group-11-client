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
  useToast,
  IconButton,
  Collapse,
  Card,
  Avatar,
  Icon
} from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket.js"

import { useParams, useNavigate } from "react-router-dom"
import { InfoIcon } from "@chakra-ui/icons"
import {
  boardVariant,
  shipsVariant,
  readyVariants,
  lobbyVariants,
  buttonVariants,
  navigationButtonVariant,
} from "../animations/variants.js"
import Rules from "../components/Rules.jsx"

let socket = null
function Setup() {
  const {
    user,
    player,
    setPlayer,
    lobby,
    direction,
    setDirection,
    handleSelect,
    handlePlace,
    setEnemy,
    enemy,
  } = useContext(GameContext)

  const [isStartSetup, setIsStartSetup] = useState(false)
  const [waitingSpinner, setWaitingSpinner] = useState(false)
  const [enemyExit, setEnemyExit] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const { lobbyCode } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const hostId = lobby?.hostId

  useEffect(() => {
    console.log("effect ran...")
    socket = Stomp.client(getDomainWebsocket())
    socket.connect({}, onConnected, errorCallback)
    console.log("player : ", player, "enemy: ", enemy)

    if (lobby?.lobbyCode !== lobbyCode)
    throw ({
      message: "The Game session does not exist", 
      desc: "The lobby does not exist. You may have tried to access an external lobby or accidentally refreshed the site"
    })

    if (player.isReady && enemy.isReady){
      console.log("players are ready, will redirect shortly...")
      setTimeout(() => {
        navigate(`/game/${lobbyCode}`)
      }, 3000)
       

      }
  }, [enemy.isReady, player.isReady])

  const errorCallback = (m) => {
    console.log("mmm", m)
  }

  const onConnected = () => {
    console.log("Stomp client connected !", lobbyCode)
    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    console.log("websocket connected!")
    socket.subscribe(
      `/ready/${
        user.id === lobby?.hostId ? lobby?.joinerName : lobby?.hostName
      }`,
      onReady
    )
    console.log(
      "user.id",
      user.id,
      "lobby.hostId",
      lobby.hostId,
      "joinerName",
      lobby.joinerName,
      "hostName",
      lobby.hostName
    )
    console.log(user.id)
    socket.subscribe(`/game/${lobbyCode}/leave`, onLeave)
  }

  async function startGame() {
    try {
      await api.post(`/startgame`, JSON.stringify({ lobbyCode, hostId }))
    } catch (error) {
      console.log("server error", error.message)
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
      playerAvatar: user.avatar,
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
        newGame: false,
      }))

      setEnemy((enemy) => ({
        ...enemy,
        id: payloadData.player2Id,
        name: payloadData.player2Name,
        newGame: false,
      }))
    } else {
      setPlayer((player) => ({
        ...player,
        id: payloadData.player2Id,
        name: payloadData.player2Name,
        newGame: false,
      }))
      setEnemy((enemy) => ({
        ...enemy,
        id: payloadData.player1Id,
        name: payloadData.player1Name,
        newGame: false,
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
      avatar: payloadData.playerAvatar,
    }))
    toast({
      title: "Opponent is Ready",
      description: "Captain the Enemy is in sight!",
      status: "info",
      duration: 3000
    })
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
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mb={50}
      h={isStartSetup ? "60vh" : "70vh"}
    >
      {isStartSetup ? (
        <Flex justifyContent="center" alignItems="center">
          <AnimationContainer variants={boardVariant}>
            <Flex direction="column" alignItems="center">
              <Card
                padding="4px 5px"
                direction="flex"
                w={200}
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                variant="filled"
                bgGradient="linear(to-l, #4FD1C5, #B7E8EB)"
              >
                <Avatar src={user.avatar} />
                <Text>{player.name}</Text>
              </Card>
              <BattleshipBoard
                board={player.board}
                handlePlace={placeShip}
                isSetUp={true}
                direction={direction}
              />
            </Flex>
          </AnimationContainer>
          <Flex direction="column" minW="300px" justifyContent="center" h="100%">
            <AnimationContainer variants={shipsVariant}>
              {player.ships.length !== 0 && (
                <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
                  Place your ships
                </h2>
              )}
              <Flex direction="column" minH="300px">
                {player.ships.map((ship) => (
                  <Ship
                    key={ship.id}
                    type={ship.type}
                    length={ship.length}
                    isHeld={ship.isHeld}
                    handleSelect={selectShip}
                    playerId={player.id}
                    shipId={ship.id}
                    direction={direction}
                  />
                ))}
                {player.ships.length !== 0 && (
                  <>
                    <FormLabel
                      fontSize="20px"
                      htmlFor="direction"
                      fontWeight="bold"
                      color="black"
                    >
                      {direction}
                    </FormLabel>
                    <Switch
                      id="direction"
                      mb={10}
                      onChange={handleToggle}
                      sx={{
                        "span.chakra-switch__track:not([data-checked])": {
                          background: "teal",
                        },
                      }}
                    />
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
                  size="lg"
                >
                  Ready
                </Button>
              </AnimationContainer>
            )}
          </Flex>
          <AnimationContainer variants={navigationButtonVariant}>
            <Icon
              aria-label="Show Rules"
              onClick={toggleRules}
              _hover={{ transform: "scale(1.1)" }}
              cursor="pointer"
              boxSize={8}
              alignSelf="flex-start"
              mt="-400px"
            />
        </AnimationContainer>
          <Rules showRules={showRules} toggleRules={toggleRules} currentPage="setup"/>
          {/* <Collapse in={showRules}>
            <Text fontSize="sm" color="gray.500" textAlign="left">
              <Text as="b">Set-up: </Text>
              <br />
              Select the ship you want to place and hover over the field to see
              its arrangement. <br />
              Click on the field to place the ship, but keep in mind that once a
              ship is placed, you cannot undo it!
              <br />
              Your ships can touch each other, but they cannot overlap.
              <br />
              Use the button to switch between horizontal and vertical placement
              of the ships.
              <br />
              Make sure to place all your ships before starting the game. <br />
              Good Luck, Captain!
              <br />
            </Text>
          </Collapse> */}
        </Flex>
      ) : user.isHost ? (
        <AnimationContainer variants={navigationButtonVariant}>
          <Button
            onClick={startGame}
            alignSelf="center"
            size="lg"
            variant="brand"
            isLoading={isStartSetup}
            
          >
            Start Setup
          </Button>
        </AnimationContainer>
      ) : (
        <AnimationContainer variants={lobbyVariants}>
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
              Please wait for the Host to start the Round...
            </Text>
          </Flex>
        </AnimationContainer>
      )}
      {enemyExit && <EnemyExitModal enemyExit={enemyExit} />}
    </Box>
  )
}
export default Setup
