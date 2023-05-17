import { Box, Grid, GridItem } from "@chakra-ui/react"
import { React, useState } from "react"
import Cell from "./Cell"

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

  return (
    <Grid
      templateColumns="repeat(11, 40px)"
      templateRows="repeat(11, 40px)"
      gap={0.5}
      margin="20px"
      marginRight="40px"
    >
      <GridItem />

      {Array.from(Array(10)).map((_, index) => (
        <GridItem
          key={`row-label-${index}`}
          justifyContent="center"
          alignItems="center"
          h="40px"
          w="40px"
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
              h="40px"
              w="40px"
              textAlign="center"
              display="flex"
            >
              {String.fromCharCode(65 + rowIndex)}
            </GridItem>
            {row.map((col, colIndex) => (
              <GridItem key={`${rowIndex}-${colIndex}`}>
                <Cell
                  key={`${String.fromCharCode(65 + rowIndex)}${colIndex}`}
                  hasShip={board[rowIndex][colIndex].isOccupied}
                  isHovered={hoveredCells.some(
                    (id) => board[rowIndex][colIndex].id === id
                  )}
                  handleCellHover={() => handleCellHover(rowIndex, colIndex)}
                  isValid={isValid}
                  cellHover={
                    isEnemy &&
                    !(
                      board[rowIndex][colIndex].isHit ||
                      board[rowIndex][colIndex].isShotAt
                    ) && { bg: "gray.300" }
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
                  handleClick={
                    isSetUp
                      ? () => handlePlace(rowIndex, colIndex) //only for the setup stage
                      : isTurn // if game already started, check if its player's turn
                      ? board[rowIndex][colIndex].isHit ||
                        board[rowIndex][colIndex].isShotAt //check if the cell has already been hit before
                        ? () =>
                            handleError("We already shot this place captain!")
                        : () => handleShoot(rowIndex, colIndex)
                      : isEnemy
                      ? () =>
                          //if its not the player's turn...
                          handleError(
                            "Hold your horses,Captain! It's not your turn to shoot!"
                          )
                      : () =>
                          handleError("Captain, are you trying to kill us?!")
                  }
                  cellColor={
                    board[rowIndex][colIndex].isOccupied //first check if cell is occupied
                      ? board[rowIndex][colIndex].isOccupied.isSunk //check if ship is sunk
                        ? "gray.700"
                        : isEnemy // then check if its in enemyBoard
                        ? board[rowIndex][colIndex].isHit
                          ? "red.500" //red when enemy ship has been hit
                          : "transparent" //"hide" the enemy ship otherwise
                        : "cyan.700" //for player render their ships blue
                      : "transparent" // else if there is nothing occupying the cell
                  }
                >
                  {!isEnemy // this is shown on the player's board
                    ? board[rowIndex][colIndex].isHit
                      ? "X"
                      : board[rowIndex][colIndex].isShotAt
                      ? "O"
                      : ""
                    : isEnemy && board[rowIndex][colIndex].isShotAt && "O"}
                </Cell>
                {/* <Box
                  display ="flex"
                  textAlign="center"
                  fontSize="xx-large"
                  alignItems="center"
                  justifyContent="center"
                  color="red.500"
                  id={`${String.fromCharCode(65 + rowIndex)}${colIndex}`}
                  h="40px"
                  w="40px"
                  border="1px solid gray"
                  _hover={isEnemy && 
                        !(board[rowIndex][colIndex].isHit || board[rowIndex][colIndex].isShotAt) && 
                        { bg: "gray.300" }}
                  cursor={isSetUp ? "pointer" : isTurn ? "crosshair" : isEnemy ? "not-allowed" : ""}


                 bg={
                    board[rowIndex][colIndex].isOccupied //first check if cell is occupied
                    ? board[rowIndex][colIndex].isOccupied.isSunk //check if ship is sunk
                      ? "gray.700"
                      : isEnemy // then check if its in enemyBoard
                        ? board[rowIndex][colIndex].isHit
                          ? "red.500" //red when enemy ship has been hit
                          : "transparent" //"hide" the enemy ship otherwise
                        : "cyan.700" //for player render their ships blue
                      : "transparent" // else if there is nothing occupying the cell
                  }

                  onClick={
                    isSetUp 
                      ? () => handlePlace(rowIndex, colIndex) //only for the setup stage
                      : isTurn // if game already started, check if its player's turn
                      ? (board[rowIndex][colIndex].isHit || board[rowIndex][colIndex].isShotAt) //check if the cell has already been hit before
                        ? () => handleError("We already shot this place captain!")
                        : () => handleShoot(rowIndex, colIndex)
                        : isEnemy
                         ? () => //if its not the player's turn...
                          handleError(
                            "Hold your horses,Captain! It's not your turn to shoot!"
                          )
                      : () => handleError("Captain, are you trying to kill us?!")
                  }
                >
                  {!isEnemy // this is shown on the player's board
                    ? board[rowIndex][colIndex].isHit
                      ? "X"
                      : board[rowIndex][colIndex].isShotAt
                      ? "O"
                      : ""
                    : isEnemy && board[rowIndex][colIndex].isShotAt && "O"}
                </Box> */}
              </GridItem>
            ))}
          </>
        ))}
    </Grid>
  )
}

export default BattleshipBoard
