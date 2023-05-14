import React from "react"
import { Link } from "react-router-dom"
import { Button, Box, Flex, Heading } from "@chakra-ui/react"
import AnimationContainer from "../components/AnimationContainer"

const homeVariants = {
  hidden: {
    opacity: 0,
    y: 300,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 0.5, duration: 1.6 },
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
      <Button size="lg">
        <Link to="login">Join The Battle!</Link>
      </Button>
    </Flex>
    </AnimationContainer>
  )
}


export default Home