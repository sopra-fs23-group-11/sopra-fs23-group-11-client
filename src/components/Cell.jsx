import React from "react"
import { Box } from "@chakra-ui/react"

export default function Cell({
  hasShip,
  isHovered,
  handleCellHover,
  isValid,
  handleClick,
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
      bg={cellColor}
      border="1px solid gray"
      onMouseEnter={handleCellHover}
      onMouseLeave={handleCellHover}
      onClick={handleClick}
      bgColor={isHovered ? (hasShip || !isValid ? "red" : "gray") : ""}
      _hover={cellHover}
      cursor={cursor}
      borderRadius="5px"
    >
      {children}
    </Box>
  )
}
