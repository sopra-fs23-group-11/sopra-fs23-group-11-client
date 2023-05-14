import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api, handleError } from "../helpers/api"
import { Box, Button, Text, Avatar } from "@chakra-ui/react"
import {GameContext} from "../contexts/GameContext"
import AnimationContainer from "../components/AnimationContainer"
const Profile = () => {
  const {user} = useContext(GameContext)
  const navigate = useNavigate()

  const goBack = () => {
    navigate(`/lobby`)
  }

  let content = (
    <div className="game">
      <ul className="game user-list">
        <Avatar size="2xl" src={user.avatar} />
        <li> Account username: {user.name}</li>
        <li>Account ID: {user.id}</li>
        <li> Account Status: {user.status}</li>
        <li> Account Wins: {user.totalWins}</li>
      </ul>
    </div>
  )
  return (
    <AnimationContainer>
      <Button mt={4} width="10%" onClick={() => goBack()}>
        Back
      </Button>
      <Box></Box>
      <Box textAlign="center">
        <Text fontWeight="bold" textAlign="center" fontSize="3xl">
          Welcome to your Profile
        </Text>
        <Text fontSize="xl">This is your Information:</Text>
        <Box>{content}</Box>
      </Box>
    </AnimationContainer>
  )
}
export default Profile