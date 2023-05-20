import React from "react"
import { useRouteError } from "react-router-dom"
import { Box, Heading } from "@chakra-ui/react"

export default function Error() {
  const error = useRouteError()

  return (
    <Box display="flex" h="70%" flexDirection="column" alignItems="center" w="100%">
      <Heading>{error.message}</Heading>
      <pre>{error.desc}</pre>
    </Box>
  )
}
