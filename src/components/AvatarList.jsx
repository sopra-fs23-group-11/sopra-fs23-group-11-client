import React, { useState, useEffect } from "react"
import { randomAvatarStlye, generateRandomSeed } from "../helpers/diceBear"
import {
  Box,
  Image,
  Tooltip,
  IconButton,
  SkeletonCircle,
} from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"

export default function AvatarList({ onSelect, selectedAvatar }) {
  const [avatars, setAvatars] = useState([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const skeletonList = () => {
    const loadingSkeletons = []
    for (let i = 0; i < 16; i++) {
      loadingSkeletons.push(<SkeletonCircle size="20" m={1}/>)
    }
    return loadingSkeletons
  }
  const [skeleton, setSkeleton]  = useState(skeletonList())

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
        {skeleton.map(item => item)}
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
            bgGradient="linear(to-l, #0172AF, #4FD1C5)"
            variant="brand"
            _hover="none"
          />
    </Box>
  )
}
