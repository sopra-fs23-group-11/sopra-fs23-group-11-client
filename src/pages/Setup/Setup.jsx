
import React, { useState, useContext, useEffect } from "react"

import Board from "./Board.jsx"
import ShipBoard from "./ShipBoard.jsx"
import { Box, Button, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

import GameBoard from "../Game/GameBoard.jsx"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"

import "./Setup.css"
import { api } from "../../helpers/api.js"
import { useParams } from "react-router"


const Setup = () => {
  const [shipPositions, setShipPositions] = useState([])
  const [game, setGame] = useState(null)
  const [socket, setSocket] = useState(null)
  const [startGame, setStartGame] = useState(false)
  const { lobbyCode } = useParams()
  const [isHost, setIsHost] = useState(false)
  const user = JSON.parse(sessionStorage.getItem("user"))
  const userId = user.id
  const {host, setHost, joiner, setJoiner} = useContext(GameContext)
  const hostId = host.hostId

  // if(stompClient) {
  //   const sub = stompClient.subscribe(`/game/${lobbyCode}`, (payload) => {
  //     console.log(`Player joined: ${JSON.parse(payload.body)}`)
  //   })
  //   console.log(sub)
  // }
  function handleShipPlacement(positions) {
    console.log("position", positions)
    setShipPositions(positions)
  }

  console.log("shipPosition", shipPositions)

  //set up api request to start a game
   useEffect(() => {
    async function startGame() {
      try {
        if(!game) {

          const response = await api.post(
            `/startgame`,
            JSON.stringify({ lobbyCode, hostId })
          )
          setGame(response.data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    startGame()
  }, [lobbyCode])

  return (

    <Box>
      <>
        <h2>Host ID: {host.hostId}</h2>
        <h2>Host Name: {host.hostName}</h2>
        <h2>Joiner ID: {joiner.joinerId}</h2>
        <h2>Joiner Name: {joiner.joinerName}</h2>
        </>
      {startGame ? (
        <div className="float-container">
          <div className="float-child1">
            <Board shipPositions={shipPositions} />
          </div>
          <div className="float-child2">
            <div className="ship-board-container">
              <ShipBoard onShipPlacement={handleShipPlacement} lobbyCode={lobbyCode} />
              <div className="button-container">
                <Box>
                  <Button
                    as={Link}
                    to={`/game/${lobbyCode}`}
                    colorScheme="blue"
                  >
                    Submit Ships
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        </div>
      ) : (
        host.hostId === user.id ?
        <Button onClick={startSetup}>Start Setup</Button>
        :
        <Text>Preparing Setup stage...</Text>
      )}
    </Box>

  )
}

export default Setup
