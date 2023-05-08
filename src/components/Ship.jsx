import React from "react"
import { Grid, GridItem, Box } from "@chakra-ui/react"

export default function Ships(props) {

   
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={4}>
      <GridItem colSpan={1}>
        <Box 
        borderWidth="1px"
        borderRadius="md"
        p={2}
        textAlign="center"
        onClick={() => props.handleSelect(props.shipId)}
        bg={props.isHeld  ? "#59E391" : "white"}
        >
          <p>{props.type}</p>
          <p>{props.length}</p>
        </Box>
      </GridItem>
    </Grid>
  )
}
