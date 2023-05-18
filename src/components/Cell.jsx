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
      h="40px"
      w="40px"
      bg={isHovered? "gray" : cellColor}
      border="1px solid gray"
      onMouseEnter={handleCellHover}
      onMouseLeave={handleCellHover}
      onClick={handleClick}
     
      _hover={cellHover}
      cursor={cursor}
      borderRadius="5px"
      className={isClicked ? "clicked": ""}
    >
      {children}
    </Box>
  )
}
