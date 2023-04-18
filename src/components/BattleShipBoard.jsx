import { Box, Grid, GridItem } from "@chakra-ui/react"
import { React, useState } from "react"

function BattleshipBoard({socket}) {
  const [board, setBoard] = useState(Array(10).fill(Array(10).fill(false)))


  const handleClick = (e, rowIndex, colIndex) => {
    //console.log(e.target.id)
    const position = e.target.id

    socket.send("/app/game-simple", {}, JSON.stringify({position}))

    const newBoard = board.map((row, rIndex) =>
      row.map((col, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? !col : col
      )
    );
    setBoard(newBoard);
  }

  return (
    <Grid
      templateColumns="repeat(10, 20px)"
      templateRows="repeat(10, 20px)"
      gap={0}
      marginTop="20px"
    >
      {board.map((row, rowIndex) =>
        row.map((col, colIndex) => (
          <GridItem key={`${rowIndex}-${colIndex}`}>
            <Box
              id={`${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
              h="20px"
              w="20px"
              border="1px solid gray"
              bg={board[rowIndex][colIndex] ? "blue" : "white"}
              onClick={(e) => handleClick(e, rowIndex, colIndex)}
            />
          </GridItem>
        ))
      )}
    </Grid>
  )
}

export default BattleshipBoard
