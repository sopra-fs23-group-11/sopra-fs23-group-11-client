import { Text, Button, Flex } from "@chakra-ui/react"

import React, { useContext, useEffect } from "react"

import { Link } from "react-router-dom"
import { GameContext } from "../../contexts/GameContext"
function Lobby() {
  const userData = JSON.parse(sessionStorage.getItem("user"))
  const { setUser, user } = useContext(GameContext)

  // useEffect(() => {
  //   //once the user is in the lobby we extract the userData from the sessionStorage and store it in context
  //   setUser((prev) => ({
  //     ...prev,
  //     name: userData.username,
  //     id: userData.id,
  //     avatar: userData.avatar,
  //   }))
  // }, [])

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
          <Text fontWeight="bold" color="white">
            ID: {user.id}
          </Text>
        </h2>
        <h2>
          <Text fontWeight="bold" color="white">
            Name: {user.name}
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
