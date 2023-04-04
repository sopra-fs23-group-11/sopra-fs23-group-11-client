import React from 'react'
import { Heading } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

export default function LobbyLayout() {
  return (
    <div>
        <Heading>Lobby</Heading>
        <Outlet/>
    </div>
  )
}
