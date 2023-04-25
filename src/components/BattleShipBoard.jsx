import { Box, Grid, GridItem } from "@chakra-ui/react"
import { React, useState } from "react"

function BattleshipBoard({ socket, board, handlePlace }) {
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
                bg={board[rowIndex][colIndex].isOccupied ? "blue" : "white"}
                // onClick={() => handleShoot(rowIndex, colIndex)}
                onClick={()=> handlePlace(rowIndex, colIndex)}
              />
            </GridItem>
          ))}
        </>
      ))}
    </Grid>
  )
}

export default BattleshipBoard
