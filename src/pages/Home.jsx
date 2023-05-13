import React from "react"
import { Link } from "react-router-dom"
import { Button, Box, Flex, chakra, shouldForwardProp, Heading } from "@chakra-ui/react"
import { motion, isValidMotionProp } from "framer-motion"
import withAnimation from "../HOC/withAnimation"


function Home() {
  return (
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
  )
}


export default withAnimation(Home, "HOME")