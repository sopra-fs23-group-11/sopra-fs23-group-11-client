import React from "react"
import { Flex, Heading } from "@chakra-ui/react"
import { Link } from "react-router-dom"
export default function NotFound() {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" h="80%">
      <Heading>Sorry, the page you were looking for was not found</Heading>
      <Link to="/lobby">Return to Menu</Link>
    </Flex>
  )
}
