import { Button, Heading, Flex } from "@chakra-ui/react"
import React from "react"
import { Link, Outlet } from "react-router-dom"

function Lobby() {
  return (
    <div className="">
      <Heading>Lobby</Heading>
      <Outlet/>
      <Flex
        flexDirection="column"
        height="400px"
        gap="20px"
        justifyContent="center"
        alignItems="center"
      >
        <Link to="host">
          <Button w="200px" size="lg">Host</Button>
        </Link>
        <Link to="join">
          <Button w="200px" size="lg">Join</Button>
        </Link>
      </Flex>
    </div>
  )
}

export default Lobby
