import { chakra, shouldForwardProp, Box } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import React from "react";

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const defaultVariants = {
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

const AnimationContainer = ({ children, variants }) => {
  return (
    <MotionBox
      variants={variants ? variants : defaultVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", delay: 0.5 }}
    >
      <>{children}</>
    </MotionBox>
  );
};

export default AnimationContainer;
