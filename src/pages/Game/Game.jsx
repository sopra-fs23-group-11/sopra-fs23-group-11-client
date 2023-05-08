import React, { useContext, useEffect, useState } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ship from "../../components/Ship.jsx"
import { api } from "../../helpers/api.js"
import "./Game.css"

import { Flex, Button, Box, Text, Spinner } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
} from "@chakra-ui/react";

import { useParams, Link, useNavigate } from "react-router-dom"

let socket = null
function Game() {
  const {
    user,
    player,
    setPlayer,
    lobby,
    direction,
    setDirection,
    errorLogs,
    setErrorLogs,
    handleSelect,
    handlePlace,
    game,
    setGame,
    setEnemy, 
    enemy
  } = useContext(GameContext)

  const [isStartSetup, setIsStartSetup] = useState(false)
  const [waitingSpinner, setWaitingSpinner] = useState(false)
  const { lobbyCode } = useParams()
  console.log(player.isReady, enemy.isReady)
  const navigate = useNavigate()
  const hostId = lobby.hostId
  console.log(lobby, player, game)

  // console.log(playerOne.isReady, playerTwo.isReady)
  async function startSetup() {
    try {
      const response = await api.post(
        `/startgame`,
        JSON.stringify({ lobbyCode, hostId })
      )
      //setGame(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  async function playerReady() {
    setPlayer((player) => ({ ...player, isReady: true }))

    const readyMessage = {
      gameId: lobbyCode,
      playerId: player.id,
      playerName: player.name,
    }
    setWaitingSpinner(true)
    socket.send(`/app/ready`, {}, JSON.stringify(readyMessage))
    // if(isReady)
    // setIsReady(true)
  }

  // function onReady(payload) {
  //   const payloadData = JSON.parse(payload.body)
  //   console.log(payloadData)
  // }

  useEffect(() => {
    console.log("effect ran...")
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected, errorCallback)

    if(player.isReady && enemy.isReady)navigate(`/main/${lobbyCode}`)
  }, [enemy.isReady, player.isReady])

  const errorCallback = (m) => {
    console.log("mmm", m)
  }

  const onConnected = () => {
    console.log("Stomp client connected !", lobbyCode)

    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    console.log("websocket connected!")
    socket.subscribe(
      `/ready/${user.id === lobby.hostId ? lobby.joinerName : lobby.hostName}`,
      onReady
    )
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
        isMyTurn: true
      }))

      setEnemy(enemy => ({
        ...enemy,
        id: payloadData.player2Id,
        name: payloadData.player2Name
      }))
    } else {
      setPlayer((player) => ({
        ...player,
        id: payloadData.player2Id,
        name: payloadData.player2Name,
      }))
      setEnemy(enemy => ({
        ...enemy,
        id: payloadData.player1Id,
        name: payloadData.player1Name
      }))

    }

    setGame(payloadData)

    console.log("isStartsetup", isStartSetup)
    setIsStartSetup(true)
  }

  const onReady = (payload) => {
    console.log("game starts on REady")
    const payloadData = JSON.parse(payload.body)
    setEnemy(enemy => ({...enemy, isReady: true}))

  }

  const selectShip = (shipId) => {
    handleSelect(shipId)
  }

  const placeShip = (rowIndex, colIndex) => {
    handlePlace(rowIndex, colIndex)
  }

  const handleClick = () => {
    setDirection(direction === "Horizontal" ? "Vertical" : "Horizontal")
  }

 
  return (
    <Box>
      <>
        <h2>Player1: {user.isHost ? player.name : enemy.name}</h2>
        <h2>Player2: {user.isHost ? enemy.name : player.name}</h2>
        <h2>
          {" "}
          Click the button on the right to make your ship vertical or horizontal
        </h2>
        {errorLogs.length > 0 && <h3> Following error in placements:</h3>}
        {errorLogs.length > 0 &&
            <Stack spacing = {3} >
              { errorLogs.map (error => {
                return(
                    <Alert status ='error'>
                      <AlertIcon />
                      {error}
                    </Alert>
                )
              })}
            </Stack>
        }
      </>
      {isStartSetup ? (
        <Flex>
          <div className="board-container">
            <BattleshipBoard
              socket={socket}
              board={player.board}
              handlePlace={placeShip}
              playerId={player.id}
              playerName={player.name}
            />
          </div>
          <div className="ship-container">
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
            { player.ships.length !== 0 &&
                <button className="button-orientation" onClick={handleClick}>
              {direction}
            </button>}
          </div>
        </Flex>
      ) : user.isHost ? (
        <Button onClick={startSetup}>Start Setup</Button>
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
      {player.ships.length === 0 && (
        <Button onClick={playerReady} isDisabled={waitingSpinner}>
          {!waitingSpinner ? (
            "Ready"
          ) : (
            <>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
              />
              <Text>Good Luck Captain, See you on the other side 🫡</Text>
            </>
          )}
        </Button>
      )}
    </Box>
  )
}
export default Game
