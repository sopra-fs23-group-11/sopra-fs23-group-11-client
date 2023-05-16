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
import Profile from "./pages/Profile"
import LobbyLayout from "./pages/Lobby/LobbyLayout"
import Setup from "./pages/Setup.jsx"
import Chatroom from "./pages/Chatroom"
import Endscreen from "./pages/Endscreen"
import Game from "./pages/Game"
import AuthRequired from "./components/AuthRequired"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} action={registerAction} />
      <Route path="login" element={<Login />} action={loginAction} />

      {/* user needs to log in first to access the below routes */}

      <Route element={<AuthRequired />}>
        <Route path="lobby" element={<LobbyLayout />}>
          <Route index element={<Lobby />} />
          <Route path="host" element={<Host />} />
          <Route path="join" element={<Join />} />
        </Route>
        <Route path="profile/:userid" element={<Profile />} />
        <Route path="setup/:lobbyCode" element={<Setup />} />
        <Route path="game/:lobbyCode" element={<Game />} />
        <Route path="chatroom/:lobbyCode" element={<Chatroom />} />
        <Route path="endscreen/:lobbyCode" element={<Endscreen />} />
      </Route>
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
