import { chakra, shouldForwardProp, transition } from "@chakra-ui/react"
import { motion, isValidMotionProp } from "framer-motion"
import React from "react"

const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
})

const variants1 = {
  hidden: {
    opacity: 0,
    y: 300,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 0.5, duration: 1.6 },
  },
}

const variants2 = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.5 },
  },
}

const variants3 = {
  hidden: {
    y: -300,
  },
  visible: {
    y: -10,
    transition: { delay: 0.8 },
  },
}




const withAnimation = (Component, type) => {
  const WrappedComponent = (props) => {
    let containerVariants

    if(type === "HOME") containerVariants = variants1
    if(type === "LOBBY") containerVariants = variants2
    if(type === "HEADER") containerVariants = variants3
    return (
      <ChakraBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ type: "spring", delay: 0.5 }}
      >
        <Component {...props} />
      </ChakraBox>
    )
  }
  return WrappedComponent
}

export default withAnimation
