import React from "react"
import { Outlet } from "react-router-dom"
import "../css//WaveAnimation.css"
import { Box } from "@chakra-ui/react"
import AnimationContainer from "./AnimationContainer"

const waveVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.7,
        delay: 0.5,
        ease: "easeOut"
        
    }
  },
}
export default function Layout() {
  return (
    <Box bgGradient="radial-gradient(ellipse at center, rgba(255,254,234,1) 0%, rgba(255,254,234,1) 35%, #B7E8EB 100%)" height="100vh" >
        <div className="ocean">
      <AnimationContainer variants={waveVariants}>
          <div className="wave"></div>
          <div className="wave"></div>
        </AnimationContainer> 
        </div>
        <Outlet />
    </Box>
  )
}
