import React, { useState,useEffect } from "react"
import Board from "./Board.jsx"
import ShipBoard from "./ShipBoard.jsx"
import { Box, Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"


import "./Setup.css"
import {api} from "../../helpers/api.js";
import {useParams} from "react-router";

const Setup = () => {
  const [shipPositions, setShipPositions] = useState([])
  function handleShipPlacement(positions) {
    console.log("position", positions)
    setShipPositions(positions)
  }

  const [game, setGame] = useState(null)
  const{lobbyCode} = useParams()
  const hostId = localStorage.getItem("hostId")
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
    <div className="float-container">
      <div className="float-child1">
        <Board shipPositions={shipPositions} />
      </div>
      <div className="float-child2">
        <div className="ship-board-container">
          <ShipBoard onShipPlacement={handleShipPlacement} />
          <div className="button-container">
            <Box>
              <Button as={Link} to={`/game/${lobbyCode}`} colorScheme="blue">
                Submit Ships
              </Button>
            </Box>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Setup
