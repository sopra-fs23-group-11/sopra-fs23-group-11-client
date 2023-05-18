import React from 'react';
import { Heading, Box,Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';


export default function LobbyLayout() {

  return (
    <Box>
      {/* <Text>Back button here</Text> */}
      <Outlet />
    </Box>
  );
}
