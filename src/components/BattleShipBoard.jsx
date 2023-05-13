import { Box, Grid, GridItem } from "@chakra-ui/react"
import { React } from "react"

function BattleshipBoard({
  board,
  handlePlace,
  handleShoot,
  isEnemy,
  isTurn,
  isSetUp,
}) {
  return (
    <Grid
      templateColumns="repeat(11, 30px)"
      templateRows="repeat(11, 30px)"
      gap={0}
      margin="20px"
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
            >
              {String.fromCharCode(65 + rowIndex)}
            </GridItem>
            {row.map((col, colIndex) => (
              <GridItem key={`${rowIndex}-${colIndex}`}>
                <Box

                  textAlign="center"
                  color="red.500"
                  id={`${String.fromCharCode(65 + rowIndex)}${colIndex}`}
                  h="30px"
                  w="30px"
                  border="1px solid gray"
                  _hover={isEnemy && 
                        !(board[rowIndex][colIndex].isHit || board[rowIndex][colIndex].isShotAt) && 
                        { bg: "gray.100" }}
                  cursor={isSetUp ? "pointer" : isTurn ? "crosshair" : "wait"}
                  bg={
                    board[rowIndex][colIndex].isOccupied //first check if cell is occupied
                    ? board[rowIndex][colIndex].isOccupied.isSunk //check if ship is sunk
                      ? "grey"
                      : isEnemy // then check if its in enemyBoard
                        ? board[rowIndex][colIndex].isHit
                          ? "red" //red when enemyship has been hit
                          : "transparent" //"hide" the enemy ship otherwise
                        : "blue" //for player render theri ships blue
                      : "transparent" // else if there is nothing occupying the cell
                  }
                  onClick={
                    isSetUp 
                      ? () => handlePlace(rowIndex, colIndex) //only for the setup stage
                      : isTurn // if game already started, check if its player's turn
                      ? (board[rowIndex][colIndex].isHit || board[rowIndex][colIndex].isShotAt) //check if the cell has already been hit before
                        ? () => alert("We already shot this place captain!")
                        : () => handleShoot(rowIndex, colIndex)
                      : () => //if its not the player's turn...
                          alert(
                            "Hold your horses Captain its not your Turn to shoot"
                          )
                  }
                >
                  {!isEnemy // this is shown on the player's board
                    ? board[rowIndex][colIndex].isHit
                      ? "X"
                      : board[rowIndex][colIndex].isShotAt
                      ? "O"
                      : ""
                    : isEnemy && board[rowIndex][colIndex].isShotAt && "O"}
                </Box>
              </GridItem>
            ))}
          </>
        ))}
    </Grid>
  )
}

export default BattleshipBoard
