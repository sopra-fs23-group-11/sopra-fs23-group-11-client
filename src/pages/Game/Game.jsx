import React, { useEffect, useState } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ship from "../../components/Ship.jsx"
import { api } from "../../helpers/api.js"
import { Flex, Button } from "@chakra-ui/react"

import shipsData from "../../models/ShipsData"
import { useParams, Link} from "react-router-dom"

function Game() {
  const [gameBoard, setGameBoard] = useState({
    id: 1,
    grid: generateBoard(),
  })

  const [ships, setShips] = useState(shipsData)
  const [game, setGame] = useState(null)
  const { lobbyCode } = useParams()
  const hostId = localStorage.getItem("hostId")
  const user = JSON.parse(localStorage.getItem("user"))
  const socket = null

  useEffect(() => {
    async function startGame() {
      try {
        if(!game) {

          const response = await api.post(
            `/game`,
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

  console.log(game)

  function generateBoard() {
    const rows = 10
    const cols = 10
    const boardArray = []

    for (let i = 0; i < rows; i++) {
      boardArray[i] = []
      for (let j = 0; j < cols; j++) {
        boardArray[i][j] = {
          id: `${String.fromCharCode(65 + i)}${j + 1}`,
          isShotAt: false,
          isOccupied: null,
        }
      }
    }

    return boardArray
  }

  const submitShipPosition = async (array, ship) => {
    const startPosition = array[0]
    const endPosition = array[array.length - 1]
    const shipPlayerShipId = ship.id
    const shipPlayerPlayerId = user.id
    const response = await api.post(
      "/submit/ships",
      JSON.stringify({
        shipPlayerPlayerId,
        shipPlayerShipId,
        startPosition,
        endPosition,
      })
    )
    return response
  }

  // const shootMissle = (rowIndex, colIndex) => {
  //   //console.log(e.target.id)
  //   const position = gameBoard.grid[rowIndex][colIndex].id
  //   if (socket)
  //     socket.send("/app/game-simple", {}, JSON.stringify({ position }))

  //   const newBoard = gameBoard.grid.map((row, rIndex) =>
  //     row.map((col, cIndex) =>
  //       rIndex === rowIndex && cIndex === colIndex
  //         ? { ...col, isShotAt: !col.isShotAt }
  //         : col
  //     )
  //   )
  //   setGameBoard({ id: 1, grid: newBoard })
  // }

  const selectShip = (id) => {
    const selectedShip = ships.find((ship) => ship.id === id)
    setShips((oldShips) =>
      oldShips.map((ship) => {
        return ship.id === id
          ? { ...ship, isHeld: !ship.isHeld }
          : { ...ship, isHeld: false }
      })
    )
    localStorage.setItem("selected", JSON.stringify(selectedShip))
  }

  const placeShip = async (rowIndex, colIndex) => {
    const shipToBePlaced = JSON.parse(localStorage.getItem("selected"))

    if (shipToBePlaced) {
      const length = shipToBePlaced.length
      const coordinatesToBeOccupied = []
      for (let i = 0; i < length; i++) {
        coordinatesToBeOccupied.push(gameBoard.grid[rowIndex][colIndex + i].id)
      }
      let valid = true
      gameBoard.grid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isOccupied && coordinatesToBeOccupied.includes(cell.id)) {
            valid = false
          }
        })
      )
      if (valid) {
        await submitShipPosition(coordinatesToBeOccupied, shipToBePlaced)
        const newBoard = gameBoard.grid.map((row) =>
          row.map((cell) =>
            coordinatesToBeOccupied.includes(cell.id)
              ? { ...cell, isOccupied: shipToBePlaced }
              : cell
          )
        )
        setGameBoard({ id: 1, grid: newBoard })
        setShips((oldShips) =>
          oldShips.filter((ship) => ship.id !== shipToBePlaced.id)
        )

        localStorage.removeItem("selected")
      } else {
        alert("invalid placement please try again")
      }
    } else {
      alert("please select ship first")
    }
  }

  const shipElements = ships.map((item) => (
    <Ship
      key={item.id}
      type={item.type}
      length={item.length}
      isHeld={item.isHeld}
      handleSelect={() => selectShip(item.id)}
    />
  ))

  return (
    <Flex>
      <BattleshipBoard
        key={gameBoard.id}
        socket={socket}
        board={gameBoard.grid}
        // handleShoot={shootMissle}
        handlePlace={placeShip}
      />
      <Flex direction="column">{shipElements}</Flex>
      <Button mt={3} as={Link} to={`/chatroom/${lobbyCode}`} colorScheme="blue">
        Chat with friend
      </Button>
    </Flex>
  )
}
export default Game
