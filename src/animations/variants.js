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
      transition: {duration: 0.8, delay: 0.3}
      
    }
  }
  
export  const buttonVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { delay: 2.0, duration: 1.6 },
    },
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px rgb(255,255,255)",
      boxShadow: "0px 0px 8px rgb(255,255,255)",
      transition: {
        repeatType: "mirror",
        repeat: 5,
        duration: 0.3
      }
    }
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
      transition: {ease: "easeInOut" , stiffness: 30, velocity: 1}
    }
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
          ease: "easeOut"
          
      }
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
  
export  const boardVariant = {
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
      transition: {ease: "easeInOut"}
    }
  }
  
export  const readyVariants = {
    hidden: {
      y: "-100vh",
    },
    visible: {
      y: 0,
      transition: { stiffness: 120, type: "spring" },
    },
    exit: {
      y: -100
    }
  }


export  const enemyVariant = {
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
    }
  }
  
export  const playerVariant = {
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
    }
  }
  
export  const switchTurnVariants = {
    hidden: { 
      x: '100vw' 
    },
    visible: {
      x: 0,
      transition: { type: 'spring', stiffness: 120 }
    } 
  }
  