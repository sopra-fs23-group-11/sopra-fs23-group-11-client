import {Box, Text, Button, Flex, Stack, Alert, AlertIcon} from "@chakra-ui/react"

import React, { useEffect, useState, useContext } from "react"

import { Link, useNavigate } from "react-router-dom"
import { api, handleError } from "../../helpers/api"
import { Stomp } from "stompjs/lib/stomp"
import { GameContext } from "../../contexts/GameContext"



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
        <h2><Text Text as='b' color="white">ID: {user.id}</Text></h2>
        <h2><Text Text as='b' color="white">Name: {user.username}</Text></h2>
        <Button w="200px" as={Link} to="host" size="lg">
          Host
        </Button>

        <Link to="join">
          <Button w="200px" size="lg">
            Join
          </Button>
        </Link>


        
      </Flex>
    </>
  )
}

export default Lobby
