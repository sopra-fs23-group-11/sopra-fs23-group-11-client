import React from "react"
import shipsData from "../models/ShipsData"
import { Grid, GridItem, Box } from "@chakra-ui/react"

export default function Ships() {

    function handleSelect() {
        console.log("got selected")
    }
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={4}>
      {shipsData.map((item) => (
        <GridItem key={item.id} colSpan={1}>
          <Box borderWidth="1px" borderRadius="md" p={2} textAlign="center" onClick={handleSelect}>
            <p>{item.type}</p>
            <p>{item.length}</p>
          </Box>
        </GridItem>
      ))}
    </Grid>
  )
}
