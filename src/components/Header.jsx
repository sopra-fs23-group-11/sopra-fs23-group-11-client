import React from "react"
import { Flex, Box } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { IconButton } from "@chakra-ui/react"
import {FaHome} from "react-icons/fa"
import withAnimation from "../HOC/withAnimation"


function Header() {
  return (
    <Box
      as="header"
      backgroundColor="transparent"
      color="black"
      padding="1rem"
      textAlign="center"
      fontSize="2rem"
      fontWeight="bold"
    >

      <Box borderBottom="2px solid #015871" width="90%" margin="auto" minWidth="200px">
        <Link to="/lobby">
            <Box color="#015871">
              BATTLESHIP
            </Box>
            
        </Link>
      </Box>

        {/* <IconButton
          as={FaHome}
          onClick={toMenu}
        /> */}

    </Box>
  )
}

export default withAnimation(Header, "HEADER")
