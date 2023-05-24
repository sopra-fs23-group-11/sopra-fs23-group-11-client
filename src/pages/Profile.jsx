import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api, handleError } from "../helpers/api"
import { Box, Button, Text, Avatar, Heading } from "@chakra-ui/react"
import {GameContext} from "../contexts/GameContext"
import AnimationContainer from "../components/AnimationContainer"
import { lobbyVariants } from "../animations/variants"
import {motion} from "framer-motion";
const Profile = () => {
  const {user} = useContext(GameContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user.id === null){
      const state = {message: "You may have accidentally refreshed the Page"}
      navigate("/lobby", {state})
    }
    
  }, [])



  let content = (
    <div className="game">
      <ul className="game user-list">
        <Avatar size="2xl" src={user.avatar} />
        <li> Username: {user.name}</li>
        <li> ID: {user.id}</li>
        {/* <li> Account Status: {user.status}</li> */}
        <li> Total wins: {user.totalWins}</li>
      </ul>
    </div>
  )
  return (
    <AnimationContainer variants={lobbyVariants}>

      <Box></Box>
      <Box textAlign="center">
        <Heading mb={3}>
          Welcome to your Profile
        </Heading>
        <Text fontSize="xl">This is your Information:</Text>
        <Box>{content}</Box>
      </Box>
    </AnimationContainer>
  )
}
export default Profile
