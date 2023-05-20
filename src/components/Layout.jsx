import React from "react"
import { Outlet } from "react-router-dom"
import "../css//WaveAnimation.css"
import { Box } from "@chakra-ui/react"
import AnimationContainer from "./AnimationContainer"
import { waveVariants } from "../animations/variants"
import AnimatedOutlet from "./AnimatedOutlet"
import { useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Header from "./Header"

export default function Layout() {
  return (
    <Box
      bgGradient="radial-gradient(ellipse at center, rgba(255,254,234,1) 0%, rgba(255,254,234,1) 35%, #B7E8EB 100%)"
      height="100vh"
    >
      <div className="ocean">
        <AnimationContainer variants={waveVariants}>
          <div className="wave"></div>
          <div className="wave"></div>
        </AnimationContainer>
      </div>
      <Outlet/>
    </Box>
  )
}
