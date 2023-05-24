export const homeVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", delay: 1.3, duration: 1.6 },
  },
  exit: {
    y: -300,
    opacity: 0,
    transition: { duration: 0.8, delay: 0.3 },
  },
}

export const buttonVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 2.0, duration: 1.6 },
  },
  hover: {
    scale: 1.1,
    textShadow: "0px 0px 8px black",
    boxShadow: "2px 3px 10px #B7E8EB",
    transition: {
      repeatType: "mirror",
      repeat: 5,
      duration: 0.3,
    },
  },
}

export const navigationButtonVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 1.3, duration: 1.6 },
  },
}

export const avatarCardVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 2, duration: 1.6 },
  },
}

export const lobbyVariants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.5, stiffness: 30 },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { ease: "easeInOut", stiffness: 30, velocity: 1 },
  },
}

export const headerVariants = {
  hidden: {
    y: -300,
  },
  visible: {
    y: -10,
    transition: { delay: 1 },
  },
}

export const waveVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.7,
      delay: 0.5,
      ease: "easeOut",
    },
  },
}

export const shipsVariant = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.7, stiffness: 30 },
  },
}

export const boardVariant = {
  hidden: {
    opacity: 0,
    x: "-100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.4, stiffness: 30 },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { ease: "easeInOut" },
  },
}

export const readyVariants = {
  hidden: {
    y: "-100vh",
  },
  visible: {
    y: 0,
    transition: { stiffness: 70, type: "spring" },
  },
  exit: {
    y: -100,
  },
}

export const enemyVariant = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.5, stiffness: 40 },
  },
  exit: {
    opacity: 0,
    x: 100,
  },
}

export const playerVariant = {
  hidden: {
    opacity: 0,
    x: "-100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.5, stiffness: 40 },
  },
  exit: {
    opacity: 0,
    x: 100,
  },
}

export const switchTurnVariants = {

  hidden: {
    opacity: 0,
    y: -270,
    transition: {
      duration: 1,
      ease: [0.6, 0.05, -0.01, 0.9],
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.6, 0.05, -0.01, 0.9],
    },
  },
}

// scale: 1.1,
//     textShadow: "0px 0px 8px black",
//     boxShadow: "2px 3px 10px #B7E8EB",
//     transition: {
//       repeatType: "mirror",
//       repeat: 5,
//       duration: 0.3,
//     },

export const shipSunkVariants = {
  visible: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
  },
}

export const shotVariants = {
  hidden: {
    backgroundColor: "transparent"
  },
  visible: {
    backgroundColor: "",
    transition: {
      duration: 1
    }
  },
}
