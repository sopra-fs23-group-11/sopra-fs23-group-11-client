import React, { useState, useEffect } from "react"
import { randomAvatarStlye, generateRandomSeed } from "../helpers/diceBear"
import {
  Button,
  Box,
  Image,
  Tooltip,
  IconButton,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import { useNavigation } from "react-router-dom"

export default function AvatarList({ onSelect, selectedAvatar }) {
  const [avatars, setAvatars] = useState([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAvatars = async () => {
    setIsLoading(true)
    const newAvatars = []
    for (let i = 0; i < 16; i++) {
      const response = await fetch(
        `https://api.dicebear.com/6.x/${randomAvatarStlye()}/svg?seed=${generateRandomSeed()}`
      )
      const data = response.url
      newAvatars.push(data)
    }
    setAvatars(newAvatars)
    setIsLoading(false)
  }

  const generateAvatars = () => {
    setCount((prev) => prev + 1)
  }

  const skeletonList = () => {
    const loadingSkeletons = []
    for (let i = 0; i < 16; i++) {
      loadingSkeletons.push(<Skeleton/>)
    }
    return loadingSkeletons
  }

  useEffect(() => {
    fetchAvatars()
    onSelect("")
    sessionStorage.removeItem("avatar")
  }, [count])

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(4, 1fr)"
      gridGap="2px"
      justifyContent="center"
      alignItems="center"
      mx="auto"
    >
      {isLoading ? //TODO: Render out skeletonlist correctly
      <>
        <SkeletonCircle/>
        <SkeletonCircle/>
      </> : 
      <>
      {avatars.map((avatarUrl, index) => (

        <Tooltip hasArrow label="Pick Me!" key={avatarUrl}>
          <Box
            key={avatarUrl}
            cursor="pointer"
            minW="100px"
            borderRadius="md"
            onClick={() => onSelect(avatarUrl)}
            bg={selectedAvatar === avatarUrl ? "blue.100" : "transparent"}
            _hover={{ bg: "gray.100" }}
          >
            <Image src={avatarUrl} alt="Avatar" h="100px" />
          </Box>
        </Tooltip>
      ))}
      </>
      }
          
          <IconButton
            aria-label="Refresh avatars"
            icon={<RepeatIcon />}
            onClick={generateAvatars}
            gridColumn="span 4"
            justifySelf="center"
            mt={4}
            isDisabled={isLoading}
          />
    </Box>
  )
}
