import React from 'react';
import { Heading, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';


export default function LobbyLayout() {

  return (
    <Box>
      {/* <Heading textAlign="center" mt="10rem" fontSize="5xl">
      </Heading> */}
      <Outlet />
    </Box>
  );
}
