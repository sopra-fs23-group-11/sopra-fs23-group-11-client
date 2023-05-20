import React from "react"
import { Box } from "@chakra-ui/react"
import "../css/CellAnimation.css"

export default function Cell({
  hasShip,
  isHovered,
  handleCellHover,
  isValid,
  handleClick,
  isClicked,
  cellColor,
  cellHover,
  cursor,
  isEnemy,
  isSunk,
  children,
}) {
  return (
    <Box
      display="flex"
      textAlign="center"
      fontSize="xx-large"
      alignItems="center"
      justifyContent="center"
      color="red.500"
      //   id={`${String.fromCharCode(65 + rowIndex)}${colIndex}`}
      h="30px"
      w="30px"
      bg={isHovered? "gray" : cellColor}
      border={hasShip && !isEnemy ? "" : hasShip && isEnemy && isSunk ? "" :  "1px solid gray"}
      // border = "1px solid gray"
      onMouseEnter={handleCellHover}
      onMouseLeave={handleCellHover}
      onClick={handleClick}
      
      _hover={cellHover}
      cursor={cursor}
      borderRadius={hasShip && !isEnemy ? "3px": "5px"}
      className={isClicked ? "clicked": ""}
    >
      {children}
    </Box>
  )
}
