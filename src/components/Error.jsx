import React from "react"
import { useRouteError } from "react-router-dom"
import { Box, Heading, Flex, Text } from "@chakra-ui/react"

export default function Error() {
  const error = useRouteError()

  return (
    <Box
      display="flex"
      h="70%"
      flexDirection="column"
      alignItems="center"
      w="100%"
    >
      <Heading mb={5}>{error.message}</Heading>

        <Text textAlign="center" w="50%">{error.desc}</Text>
    </Box>
  )
}
