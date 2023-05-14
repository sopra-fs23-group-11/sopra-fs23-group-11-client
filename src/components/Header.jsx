import React from "react"
import { Flex, Box } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import AnimationContainer from "./AnimationContainer"

const headerVariants = {
  hidden: {
    y: -300,
  },
  visible: {
    y: -10,
    transition: { delay: 0.8 },
  },
}

function Header() {
  return (
    <AnimationContainer variants={headerVariants}>

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
    </AnimationContainer>
  )
}

export default Header