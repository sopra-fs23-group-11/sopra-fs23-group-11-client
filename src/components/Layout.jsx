import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import "./WaveAnimation.css"
import { Box } from "@chakra-ui/react"
export default function Layout() {
  return (
    <Box bgGradient="radial-gradient(ellipse at center, rgba(255,254,234,1) 0%, rgba(255,254,234,1) 35%, #B7E8EB 100%)" height="100vh" >
        <Outlet />
        <div className="ocean">
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
    </Box>
  )
}
