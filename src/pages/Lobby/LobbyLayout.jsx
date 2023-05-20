import React from "react"
import { Heading, Box, Button } from "@chakra-ui/react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronLeftIcon } from "@chakra-ui/icons"

export default function LobbyLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const main = location.pathname

  const goBack = () => {
    navigate(`/lobby`)
  }

  return (
    <Box>
      {main === "/lobby" ? (
        ""
      ) : (
        <Button
          
          size="lg"
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          variant="brand"
          ml={4}
          onClick={() => goBack()}
          leftIcon={<ChevronLeftIcon/>}
        >
          Back
        </Button>
      )}

      <Outlet />
    </Box>
  )
}
