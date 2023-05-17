import React, { useState, useEffect, useContext } from "react"
import ship_loser from "../assets/ship_loser2.png"
import ship_winner from "../assets/ship_winner.jpg"
import {Avatar, Box, Button, Flex, Image, Spacer, Text} from "@chakra-ui/react";
import {api, handleError} from "../helpers/api.js";
import {useParams, Link, useNavigate } from "react-router-dom";
import { GameContext } from "../contexts/GameContext";
import AnimationContainer from "../components/AnimationContainer.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket.js"


function EndScreen() {

    const { lobbyCode } = useParams();
    const {user, player, enemy, lobby, setLobby, resetState} = useContext(GameContext)
    const {isReady, setIsReady} = useState(false)
    const navigate = useNavigate()


    const goLobby = () => {
        resetState()
        navigate(`/lobby`)
        // start new game
    }






    if(player.hasWon){
        return (
            <AnimationContainer>
                <Box display="flex" flexDirection="column" justifyContent="center" h="70vh">
                    <Flex alignItems="center" justifyContent="center">
                        <Box marginTop={20} marginLeft={120} textAlign="center">
                            <Text as="b" fontSize="2xl" vh={20}>
                               Congratulations !
                            </Text>
                            <Image src={ship_winner} alt="Image 1" width="500px" height="500px" />
                            <Text as="b" fontSize="1xl" mt={4}>
                                {user.name}
                            </Text>
                            <Text>total wins: {user.totalWins + 1}</Text>
                        </Box>
                        <Box>
                            <Avatar size="2xl" src={user.avatar} />
                        </Box>
                    </Flex>
                    <Flex alignItems="center" justifyContent="center">
                        <Button Align="center" mr={5} mt={10} onClick={goLobby} colorScheme="blue">
                            New Game!
                        </Button>
                    </Flex>
                </Box>
    </AnimationContainer>
        );
    }
    else{
            return (
                <AnimationContainer>
                    <Box display="flex" flexDirection="column" justifyContent="center" h="70vh">
                        <Flex alignItems="center" justifyContent="center">
                            <Box  marginTop={20} marginLeft={100} textAlign="center">
                                <Text as="b" fontSize="2xl" vh={20}>
                                    Better Luck next Time !
                                </Text>
                                <Image src={ship_loser} alt="Image 1" width="500px" height="500px" />
                                <Text as="b" fontSize="1xl" mt={4}>
                                    {user.name}
                                </Text>
                                <Text>total wins: {user.totalWins}</Text>
                            </Box>
                            <Box>
                                <Avatar size="2xl" src={user.avatar} />
                            </Box>
                        </Flex>
                        <Flex alignItems="center" justifyContent="center">
                            <Button Align="center" mr={10} mt={10} onClick={goLobby} colorScheme="blue">
                                New Game!
                            </Button>
                        </Flex>
                    </Box>
                </AnimationContainer>
            );
    }
}
export default EndScreen
