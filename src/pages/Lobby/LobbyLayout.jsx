import React, { useContext } from "react"
import { Heading, Box, Button } from "@chakra-ui/react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import AnimationContainer from "../../components/AnimationContainer"
import{ navigationButtonVariant} from "../../animations/variants.js"
import { GameContext } from "../../contexts/GameContext"

export default function LobbyLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {isDisabled} = useContext(GameContext)

  console.log(location)

  const main = location.pathname

  const goBack = () => {
    navigate(`/lobby`)
  }

  return (
    <Box>
      {main === "/lobby" ? (
        ""
      ) : (
        <AnimationContainer variants={navigationButtonVariant}>
          <Button
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            variant="brand"
            ml={4}
            onClick={() => goBack()}
            leftIcon={<ChevronLeftIcon />}
            isDisabled={isDisabled}
          >
            Back
          </Button>
        </AnimationContainer>
      )}

      <Outlet />
    </Box>
  )
}
