import React from "react"
import { Link } from "react-router-dom"
import { Button, Box, Flex, Heading, Text } from "@chakra-ui/react"
import AnimationContainer from "../components/AnimationContainer"
import { motion } from "framer-motion"
import { homeVariants, buttonVariants, soundTextVariants } from "../animations/variants"

function Home() {
  return (
    <>
      <AnimationContainer variants={soundTextVariants}>
        <Text textAlign="center">Best played with sound on 🔊</Text>
      </AnimationContainer>
      <AnimationContainer variants={homeVariants}>
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          h="80vh"
        >
          <Heading
            fontSize="5xl"
            bgGradient="linear(to-tr, #0172AF, #4FD1C5)"
            bgClip="text"
            mb={10}
            textAlign="center"
          >
            Welcome To Battleship
          </Heading>
          <AnimationContainer variants={buttonVariants}>
            <Button size="lg" variant="brand">
              <Link to="login">Join The Battle!</Link>
            </Button>
          </AnimationContainer>
        </Flex>
      </AnimationContainer>
    </>
  )
}

export default Home
