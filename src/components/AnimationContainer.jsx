import { chakra, shouldForwardProp, } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import React from "react";

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const defaultVariants = {
    hidden: {
        opacity: 0,
        x: 100,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", delay: 0.5, stiffness: 30},
      },
      exit: {
        opacity: 0,
        x: -100,
        transition: {ease: "easeInOut", stiffness: 30}
      }
}

const AnimationContainer = ({ children, variants }) => {
  return (
    <MotionBox
      variants={variants ? variants : ""}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", delay: 0.5 }}
      whileHover="hover"
      exit="exit"
    >
      <>{children}</>
    </MotionBox>
  );
};

export default AnimationContainer;
