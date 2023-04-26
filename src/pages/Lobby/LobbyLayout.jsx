import React from 'react';
import backgroundImage from './battleship.jpeg';
import { Heading, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';


export default function LobbyLayout() {
  const bgStyle = {
    position: 'relative',
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
  };

  const overlayStyle = {
    content: '',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0.1, 0.1, 0.1, 0.3)',
  };

  return (
    <Box style={bgStyle}>
      <Box style={overlayStyle}></Box>
      <Heading textAlign="center" mt="10rem" fontSize="5xl">
      </Heading>
      <Outlet />
    </Box>
  );
}
