import { Box, Grid, GridItem } from "@chakra-ui/react"
import { React, useState } from "react"

function BattleshipBoard({ socket }) {
  const [board, setBoard] = useState(generateBoard())

  function generateBoard() {
    const rows = 10
    const cols = 10
    const boardArray = []

    for (let i = 0; i < rows; i++) {
      boardArray[i] = []
      for (let j = 0; j < cols; j++) {
        boardArray[i][j] = {
          id: `${String.fromCharCode(65 + i)}${j + 1}`,
          isHit: false,
          occupied: null,
        }
      }
    }

    return boardArray
  }

  const handleClick = (e, rowIndex, colIndex) => {
    //console.log(e.target.id)
    const position = board[rowIndex][colIndex].id
    if(socket) socket.send("/app/game-simple", {}, JSON.stringify({ position }))

    const newBoard = board.map((row, rIndex) =>
      row.map((col, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? { ...col, isHit: !col.isHit }
          : col
      )
    )
    setBoard(newBoard)
  }

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
          {index + 1}
        </GridItem>
      ))}
      {board.map((row, rowIndex) => (
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
                id={`${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
                h="30px"
                w="30px"
                border="1px solid gray"
                bg={board[rowIndex][colIndex].isHit ? "blue" : "white"}
                onClick={(e) => handleClick(e, rowIndex, colIndex)}
              />
            </GridItem>
          ))}
        </>
      ))}
    </Grid>
  )
}

export default BattleshipBoard
