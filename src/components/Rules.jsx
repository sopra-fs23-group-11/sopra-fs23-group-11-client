import React, { useEffect } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react"

export default function Rules({ showRules, toggleRules, currentPage }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (showRules) onOpen()
  }, [showRules])

  const closeRules = () => {
    onClose()
    toggleRules()
  }

  const getAccordionItemIndex = () => {
    if(currentPage === "lobby") return 0
    else if (currentPage === "setup") return 1
    else if (currentPage === "game") return 2

  }

  return (
    <>
      <Drawer placement="right" onClose={closeRules} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="rgba(255,254,234,1)" bgGradient="linear(to-br, #B7E8EB, rgba(255,254,234,1))">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Ahoy Captain!</DrawerHeader>
          <DrawerBody>
            <Accordion allowToggle defaultIndex={getAccordionItemIndex()}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Welcome
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <br />
                  Welcome to our Battleship Game!
                  <br />
                  <br />
                  This is a digital implementation of the classic strategy game
                  owned by Hasbro where players engage in a battle of wits and strategy on the high seas.
                    <br />
                  <br />
                  The game challenges players to strategically position their fleet of 
                  ships on a grid and tactically guess the locations of their opponent's ships.
                  <br />
                  <br />
                  Make sure turn up the volume for better game experience!
                  <br />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Setup
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <br />
                  1. Select the ship you want to place and hover over the field to
                  see its arrangement. <br />
                  2. Click on the field to place the ship, but keep in mind that
                  once a ship is placed, you cannot undo it!
                  <br />
                  3. Your ships can touch each other, but they cannot overlap.
                  <br />
                  4. Use the button to switch between horizontal and vertical
                  placement of the ships.
                  <br />
                  5. Make sure to place all your ships before starting the game.{" "}
                  <br />
                  <br />
                  Good Luck, Captain!
                  <br />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Game
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <br />
                  1. In this stage, the players take turns shooting at each other's
                  field.
                  <br />
                  2. If a ship is hit, a red circle is displayed. If it's a miss, a
                  gray circle appears. In both cases it's the opponent's turn.
                  <br />
                  3. Once a ship has been sunk, the player gets a notification and
                  the ship position is shown in red.
                  <br />
                  4. The first player who sinks all the opponent's ships wins.
                  <br />
                  5. When the game finishes, the player can choose to "Revenge"/"New Game" in the same lobby,
                  or they can go back to the "Main Menu".
                  <br />
                  <br />
                  Have fun, Captain!
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={closeRules} variant="brand">
              Got it!
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
