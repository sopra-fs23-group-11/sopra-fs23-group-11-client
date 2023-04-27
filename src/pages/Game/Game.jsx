import React, { useContext, useEffect, useState } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ship from "../../components/Ship.jsx"
import { api } from "../../helpers/api.js"

import { Flex, Button, Box, Text } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"

import shipsData from "../../models/ShipsData"
import { useParams, Link } from "react-router-dom"


function Game() {
  // const [gameBoard, setGameBoard] = useState({
  //   id: 1,
  //   grid: generateBoard(),
  // })

  const {
    playerOne,
    playerTwo,
    setPlayerOne,
    setPlayerTwo,
    handlePlace,
    handleSelect,
    host,
    setHost,
    joiner,
    setJoiner,
  } = useContext(GameContext)

  const [game, setGame] = useState(null)
  const [isStartSetup, setIsStartSetup] = useState(false)
  const { lobbyCode } = useParams()
  const hostId = host.hostId
  const user = JSON.parse(sessionStorage.getItem("user"))
  const socket = null
  console.log(joiner)


  async function startSetup() {
    try {

      const response = await api.post(
        `/startgame`,
        JSON.stringify({ lobbyCode, hostId })
      )
      setPlayerOne((player) => ({
        ...player,
        playerId: host.hostId,
        playerName: host.hostName,
      }))
      

      setGame(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    const newSocket = Stomp.client("ws://localhost:8080/ws")
    newSocket.connect({}, () => {
      console.log("Stomp client connected !")
      newSocket.subscribe(`/game/${lobbyCode}`, (payload) => {
        const payloadData = JSON.parse(payload.body)
        // setJoiner({
        //   joinerId: payloadData.player2Id,
        //   joinerName: payloadData.player2Name,
        // })
        setPlayerTwo((player) => ({
          ...player,
          playerId: joiner.joinerId,
          playerName: joiner.joinerName,
        }))
        setIsStartSetup(true)
      })
    })
  }, [])

  // const submitShipPosition = async (array, ship) => {
  //   const startPosition = array[0]
  //   const endPosition = array[array.length - 1]
  //   const shipPlayerShipId = ship.id
  //   const shipPlayerPlayerId = user.id
  //   const response = await api.post(
  //     "/submit/ships",
  //     JSON.stringify({
  //       shipPlayerPlayerId,
  //       shipPlayerShipId,
  //       startPosition,
  //       endPosition,
  //     })
  //   )
  //   return response
  // }

  const selectShip = (shipId, playerId) => {
    handleSelect(shipId, playerId)
  }

  const placeShip = (playerId, rowIndex, colIndex) => {
    handlePlace(playerId, rowIndex, colIndex)
  }

  return (

    <Box>
      <>
        <h2>Host ID: {host.hostId}</h2>
        <h2>Host Name: {host.hostName}</h2>
        <h2>Joiner ID: {joiner.joinerId}</h2>
        <h2>Joiner Name: {joiner.joinerName}</h2>
      </>
      {isStartSetup ? (
        <Flex>
          {user.id === host.hostId ? (
            <>
              <BattleshipBoard
                socket={socket}
                board={playerOne.playerBoard}
                //handleShoot={shootMissle}
                handlePlace={placeShip}
                playerId={playerOne.playerId}
                playerName={playerOne.playerName}
              />
              <Flex direction="column">
                {playerOne.playerShips.map((ship) => (
                  <Ship
                    key={ship.id}
                    type={ship.type}
                    length={ship.length}
                    isHeld={ship.isHeld}
                    handleSelect={selectShip}
                    playerId={playerOne.playerId}
                    shipId={ship.id}
                  />
                ))}
              </Flex>
            </>
          ) : (
            <>
              <BattleshipBoard
                socket={socket}
                board={playerTwo.playerBoard}
                //handleShoot={shootMissle}
                handlePlace={placeShip}
                playerId={playerTwo.playerId}
                playerName={playerTwo.playerName}
              />
              <Flex direction="column">
                {playerTwo.playerShips.map((ship) => (
                  <Ship
                    key={ship.id}
                    type={ship.type}
                    length={ship.length}
                    isHeld={ship.isHeld}
                    handleSelect={selectShip}
                    playerId={playerTwo.playerId}
                    shipId={ship.id}
                  />
                ))}
              </Flex>
            </>
          )}
        </Flex>
      ) : host.hostId === user.id ? (
        <Button onClick={startSetup}>Start Setup</Button>
      ) : (
        <Text>Preparing Setup stage...</Text>
      )}
      {playerOne.playerShips.length === 0 &&
        (
          <Button as={Link} to={`/main`}>
            StartGame
          </Button>
        )}

      {/* <Button mt={3} as={Link} to={`/chatroom/${lobbyCode}`} colorScheme="blue">
        Chat with friend
      </Button> */}
    </Box>

  )
}
export default Game
