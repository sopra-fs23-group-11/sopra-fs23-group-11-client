import React from "react"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"

import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login, { action as loginAction } from "./pages/Login"
import Lobby from "./pages/Lobby/Lobby"
import Register, { action as registerAction } from "./pages/Register"
import Host from "./pages/Lobby/Host"
import Join from "./pages/Lobby/Join"
import LobbyLayout from "./pages/Lobby/LobbyLayout"
import Setup from "./pages/Setup/Setup.jsx"
import Game from "./pages/Game/Game.jsx"
import Chatroom from "./pages/Chatroom"
import GameBoard from "./pages/Game/GameBoard.jsx"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} action={registerAction} />
      <Route path="login" element={<Login />} action={loginAction} />
      <Route path="setup" element={<Setup />} />
      <Route path="game/:lobbyCode" element={<Game />} />
      <Route path="chatroom/:lobbyCode" element={<Chatroom />} />
      <Route path="" />

      <Route path="lobby" element={<LobbyLayout />}>
        <Route index element={<Lobby />} />
        <Route path="host" element={<Host />} />
        <Route path="join" element={<Join />} />
      </Route>
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
