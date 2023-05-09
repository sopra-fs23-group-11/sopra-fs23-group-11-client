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
                  bg={
                    board[rowIndex][colIndex].isOccupied
                      ? isEnemy
                        ? board[rowIndex][colIndex].isHit
                          ? "red"
                          : "white"
                        : "blue"
                      : "white"
                  }
                  onClick={
                    isSetUp
                      ? () => handlePlace(rowIndex, colIndex)
                      : isTurn
                      ? () => handleShoot(rowIndex, colIndex)
                      : () =>
                          alert(
                            "Hold your horses Captain its not your Turn to shoot"
                          )
                  }
                >
                  {!isEnemy
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
