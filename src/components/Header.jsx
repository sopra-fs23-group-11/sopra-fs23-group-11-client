import React from "react"
import { Box } from "@chakra-ui/react"
import { Link } from "react-router-dom"

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
        <Link to="/">
            BATTLESHIP
        </Link>
    </Box>
  )
}
