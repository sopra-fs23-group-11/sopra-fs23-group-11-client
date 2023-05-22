import { chakra, shouldForwardProp, } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import React from "react";

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});



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
