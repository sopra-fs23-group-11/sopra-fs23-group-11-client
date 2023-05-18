import React from "react"
import { useRouteError } from "react-router-dom"
import { Box, Heading } from "@chakra-ui/react"

export default function Error() {
  const error = useRouteError()

  return (
    <Box display="flex" h="70%" alignItems="center" justifyContent="center" w="100%">
      <Heading>Error : {error.message}</Heading>
    </Box>
  )
}
