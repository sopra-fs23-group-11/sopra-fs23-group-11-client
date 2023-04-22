import React, { useState } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ships from "../../components/Ships.jsx"
import { Box } from "@chakra-ui/react"

function Play() {
  const [gameBoard, setGameBoard] = useState([
    {
        id: 1,
        grid: generateBoard(),

    }
  ])
  const socket = null

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

  const shootMissle = (e, rowIndex, colIndex) => {
    //console.log(e.target.id)
    const position = gameBoard[0].grid[rowIndex][colIndex].id
    if (socket)
      socket.send("/app/game-simple", {}, JSON.stringify({ position }))

    const newBoard = gameBoard.grid.map((row, rIndex) =>
      row.map((col, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? { ...col, isShotAt: !col.isShotAt }
          : col
      )
    )
    setGameBoard()
  }

  return (
    <Box>
        {gameBoard.map(item => (
            <BattleshipBoard
                key={item.id}
              socket={socket}
              board={item.grid}
              handleShoot={shootMissle}
            />

        ))}
      <Ships />
    </Box>
  )
}
export default Play
