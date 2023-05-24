import { Circle, Grid, GridItem } from "@chakra-ui/react"
import { React, useContext, useState } from "react"
import Cell from "./Cell"
import { GameContext } from "../contexts/GameContext"
import { motion } from "framer-motion"

function BattleshipBoard({
  board,
  handlePlace,
  handleShoot,
  isEnemy,
  isTurn,
  isSetUp,
  handleError,
  direction,
}) {
  const shipToBePlaced = JSON.parse(sessionStorage.getItem("selected"))
  const length = shipToBePlaced?.length
  const [hoveredCells, setHoveredCells] = useState([])
  const [isValid, setIsValid] = useState(true)
  const { setEnemy } = useContext(GameContext)

  const handleCellHover = (rowIndex, colIndex) => {
    const shadowCells = []
    for (let i = 0; i < length; i++) {
      try {
        if (direction === "Horizontal")
          shadowCells.push(board[rowIndex][colIndex + i].id)
        else shadowCells.push(board[rowIndex + i][colIndex].id)
        setIsValid(true)
      } catch (error) {
        setIsValid(false)
      }
    }
    setHoveredCells(shadowCells)
  }

  const handleCellClick = (rowIndex, colIndex) => {
    if (isSetUp) {
      handlePlace(rowIndex, colIndex)
    } else if (isTurn) {
      const cell = board[rowIndex][colIndex]
      if (cell.isHit || cell.isShotAt) {
        handleError("We already shot this place, captain!")
      } else {
        handleShoot(rowIndex, colIndex)
      }
    } else if (isEnemy) {
      handleError("Hold your horses, Captain! It's not your turn to shoot!")
    } else {
      handleError("Captain, are you trying to kill us?!")
    }
  }

  return (
    <Grid
      templateColumns="repeat(11, 30px)"
      templateRows="repeat(11, 30px)"
      gap={0.4}
      margin="20px"
      marginRight="30px"
    >
      <GridItem />

      {Array.from(Array(10)).map((_, index) => (
        <GridItem
          key={`row-label-${index}`}
          justifyContent="center"
          alignItems="center"
          h="30px"
          w="30px"
          textAlign="center"
          display="flex"
        >
          {index}
        </GridItem>
      ))}
      {board &&
        board.map((row, rowIndex) => (
          <>
            <GridItem
              key={`col-label-${rowIndex}`}
              justifyContent="center"
              alignItems="center"
              h="30px"
              w="30px"
              textAlign="center"
              display="flex"
            >
              {String.fromCharCode(65 + rowIndex)}
            </GridItem>
            {row.map((col, colIndex) => (
              <GridItem key={`${rowIndex}-${colIndex}`}>
                <Cell
                  key={`${String.fromCharCode(65 + rowIndex)}${colIndex}`}
                  isClicked={board[rowIndex][colIndex].isOccupied}
                  hasShip={board[rowIndex][colIndex].isOccupied}
                  isHovered={hoveredCells.some(
                    (id) => board[rowIndex][colIndex].id === id
                  )}
                  handleCellHover={
                    isSetUp ? () => handleCellHover(rowIndex, colIndex) : null
                  }
                  isValid={isValid}
                  cellHover={
                    isEnemy &&
                    !(
                      board[rowIndex][colIndex].isHit ||
                      board[rowIndex][colIndex].isShotAt
                    ) && { bg: "gray.300",}
                  }
                  cursor={
                    isSetUp
                      ? "pointer"
                      : isTurn
                      ? "crosshair"
                      : isEnemy
                      ? "not-allowed"
                      : ""
                  }
                  handleClick={() => handleCellClick(rowIndex, colIndex)}
                  cellColor={
                    board[rowIndex][colIndex].isOccupied //first check if cell is occupied
                      ? board[rowIndex][colIndex].isOccupied.isSunk //check if ship is sunk
                        ? "red.500"
                        : isEnemy
                        ? "transparent" // render enemy occupied ships "hidden"
                        : "cyan.700" // render player ships blue
                      : "transparent" // if not occ
                  }
                  isEnemy={isEnemy}
                  isSunk={board[rowIndex][colIndex].isOccupied?.isSunk}
                >
                  <Circle
                    size="20px"
                    as={motion.div}
                    animate={{
                      backgroundColor: board[rowIndex][colIndex].isHit
                        ? "#E53E3E"
                        : board[rowIndex][colIndex].isShotAt
                        ? "#718096"
                        : "transparent",
                    }}
                    transition="0.5s"
                  ></Circle>
                </Cell>
              </GridItem>
            ))}
          </>
        ))}
    </Grid>
  )
}

export default BattleshipBoard
