import React, { useContext, useEffect } from "react"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext"
import { useNavigate } from "react-router-dom"

export default function EnemyExitModal({ enemyExit }) {
  const { onClose, isOpen, onOpen } = useDisclosure()
  const { resetState } = useContext(GameContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (enemyExit) {
      onOpen()
      setTimeout(() => {
        navigate("/lobby")
        onClose()
        resetState()
      }, 2000)
    }
  }, [enemyExit, onOpen])

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size="xs"
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Enemy left the Game</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          Captain, the Enemy has fled! You will be redirected to the Main Menu
        </ModalBody>

        <ModalFooter>
          {/* <Button colorScheme="blue" mr={3} >
            Return to Menu
          </Button>
          <Button onClick={onClose}>Stay</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
