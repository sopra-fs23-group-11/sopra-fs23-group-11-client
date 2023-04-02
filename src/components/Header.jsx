import React from "react"
import { Box } from "@chakra-ui/react"

export default function Header() {
  return (
    <Box
      as="header"
      backgroundColor="blue.500"
      color="white"
      padding="1rem"
      textAlign="center"
      fontSize="2rem"
      fontWeight="bold"
    >
      BATTLESHIP
    </Box>
  )
}
