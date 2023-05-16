import React from "react"
import { Link } from "react-router-dom"
import { Button, Box, Flex, Heading } from "@chakra-ui/react"
import AnimationContainer from "../components/AnimationContainer"
import { motion } from "framer-motion"

const homeVariants = {
  hidden: {
    opacity: 0,
    y: 300,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 1.3, duration: 1.6 },
  },
}

const buttonVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {delay: 2.0, duration: 1.6 },
  },
}


function Home() {
  return (
    <AnimationContainer variants={homeVariants}>

    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      h="80vh"
    >
      <Heading>Welcome To Battleship</Heading>
      <AnimationContainer variants={buttonVariants}>
        <Button size="lg">
          <Link to="login">Join The Battle!</Link>
        </Button>
      </AnimationContainer>
    </Flex>
    </AnimationContainer>
  )
}


export default Home