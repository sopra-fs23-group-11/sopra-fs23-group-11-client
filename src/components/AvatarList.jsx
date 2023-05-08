import React,  { useState, useEffect } from 'react';
import { randomAvatarStlye, generateRandomSeed } from '../helpers/diceBear';
import { Button, Box, Image, Tooltip } from '@chakra-ui/react';


export default function AvatarList({ onSelect, selectedAvatar }) {
  const [avatars, setAvatars] = useState([]);
  const [count, setCount] = useState(0)
  // Make a request to the diceBear API to get 8 avatars
  const fetchAvatars = async () => {
    const newAvatars = []
    for (let i = 0; i < 8; i++) {
      const response = await fetch(`https://api.dicebear.com/6.x/${randomAvatarStlye()}/svg?seed=${generateRandomSeed()}`);
      const data = response.url
      newAvatars.push(data)
    }
    setAvatars(newAvatars);
  }

  const generateAvatars = () => {
    setCount(prev => prev+ 1)
  }

  // Call fetchAvatars on component mount and every time the count has changed
  useEffect(() => {
    fetchAvatars();
  }, [count]);

  return (
    <Box>
      <Box display="flex" flexWrap="wrap">
        {avatars.map((avatarUrl) => (
          <Tooltip hasArrow label='Pick Me!' key={avatarUrl}>
            <Box
              key={avatarUrl}
              m="10px"
              cursor="pointer"
              borderWidth={selectedAvatar === avatarUrl ? '2px' : ''}
              borderColor={selectedAvatar === avatarUrl ? 'blue.500' : 'gray.200'}
              borderRadius="md"
              onClick={() => onSelect(avatarUrl)}
              _hover={{ borderColor: 'blue.500' }}
            >
              <Image src={avatarUrl} alt="Avatar" w="100px" h="100px" />
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Button onClick={generateAvatars}>Generate Avatars</Button>
    </Box>
  );
}
