import { Button,Flex } from "@chakra-ui/react"
import React from "react"
import { Link} from "react-router-dom"

function Lobby() {
  return (
    <>
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
    </>
  )
}

export default Lobby
