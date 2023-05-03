import { Text, Button, Flex } from "@chakra-ui/react"

import React from "react"

import { Link } from "react-router-dom"

function Lobby() {
  const user = JSON.parse(sessionStorage.getItem("user"))

  return (
    <>
      <Flex
        flexDirection="column"
        height="400px"
        gap="20px"
        justifyContent="center"
        alignItems="center"
      >
        <h2>
          <Text Text as="b" color="white">
            ID: {user.id}
          </Text>
        </h2>
        <h2>
          <Text Text as="b" color="white">
            Name: {user.username}
          </Text>
        </h2>
        <Button w="200px" as={Link} to="host" size="lg">
          Host
        </Button>

        <Link to="join">
          <Button w="200px" size="lg">
            Join
          </Button>
        </Link>

        <Button as={Link} to={`/profile/${user.id}`} w="200px" size="lg">
        Profile
      </Button>


        
      </Flex>
    </>
  )
}

export default Lobby
