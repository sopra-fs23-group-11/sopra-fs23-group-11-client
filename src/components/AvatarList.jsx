import React,  { useState, useEffect } from 'react';
import { randomAvatarStlye, generateRandomSeed } from '../helpers/diceBear';
import { Button, Box, Image, Tooltip, IconButton } from '@chakra-ui/react';
import { RepeatIcon } from "@chakra-ui/icons";

export default function AvatarList({ onSelect, selectedAvatar }) {
  const [avatars, setAvatars] = useState([]);
  const [count, setCount] = useState(0);

  const fetchAvatars = async () => {
    const newAvatars = [];
    for (let i = 0; i < 16; i++) {
      const response = await fetch(
          `https://api.dicebear.com/6.x/${randomAvatarStlye()}/svg?seed=${generateRandomSeed()}`
      );
      const data = response.url;
      newAvatars.push(data);
    }
    setAvatars(newAvatars);
  };

  const generateAvatars = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    fetchAvatars();
  }, [count]);

  return (

      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gridGap="2px" justifyContent="center" alignItems="center" mx="auto">
        {avatars.map((avatarUrl) => (
            <Tooltip hasArrow label="Pick Me!" key={avatarUrl}>
              <Box
                  key={avatarUrl}
                  cursor="pointer"
                  borderRadius="md"
                  onClick={() => onSelect(avatarUrl)}
                  bg={selectedAvatar === avatarUrl ? "blue.100" : "white"}
                  _hover={{ bg: "gray.100" }}
              >
                <Image src={avatarUrl} alt="Avatar" w="100px" h="100px" />
              </Box>
            </Tooltip>
        ))}
        <IconButton
            aria-label="Refresh avatars"
            icon={<RepeatIcon />}
            onClick={generateAvatars}
            gridColumn="span 4"
            justifySelf="center"
            mt={4}
        />
      </Box>
  );

}
