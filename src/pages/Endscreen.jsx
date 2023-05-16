import React, { useState, useEffect, useContext } from "react"
import ship_loser1 from "../assets/ship_loser1.jpg"
import ship_winner from "../assets/ship_winner.png"
import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import {api, handleError} from "../helpers/api.js";
import {useParams, Link} from "react-router-dom";
import { GameContext } from "../contexts/GameContext";



function EndScreen() {

    let [boardUser, setBoardUser] = useState(null);
    const { lobbyCode } = useParams();
    const {user, player} = useContext(GameContext)


    // useEffect(() => {
    //         async function fetchData() {
    //             try {

    //                 setBoardUser((await api.get('/board/' + user.id)).data.shipsRemaining)


    //             } catch (error) {
    //                 console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
    //                 console.error("Details:", error);
    //                 alert("Something went wrong while fetching the users! See the console for details.");
    //             }
    //         }

    //         fetchData();
    //     },
    //     []);



    if(player.hasWon){
        return (
            <div>
                <Flex alignItems="center" justifyContent="center">
                    <Box textAlign="center">
                        <Text Text as='b' fontSize='2xl' mt={4}>CONGRATULATIONS</Text>
                        <Image src={ship_winner} alt="Image 1" width="500px" height="500px"/>
                        <Text Text as='b' fontSize='1xl' mt={4}>{user.name}</Text>
                        <Text>ships remaining : {boardUser} </Text>
                        <Text>total wins: {user.totalWins+1}</Text>
                    </Box>
                </Flex>
                <Button as={Link} to={`/game/${lobbyCode}`} colorScheme="blue">
                    New Game
                </Button>
            </div>

        );
    }
    else{
            return (
                <div>
                    <Flex alignItems="center" justifyContent="center">
                        <Box textAlign="center">
                            <Text Text as='b' fontSize='2xl' mt={4}>BETTER LUCK NEXT TIME</Text>
                            <Image src={ship_loser1} alt="Image 1" width="500px" height="500px"/>
                            <Text Text as='b' fontSize='1xl' mt={4}>{user.name}</Text>
                            <Text>ships remaining : 0 </Text>
                            <Text>total wins: {user.totalWins}</Text>
                        </Box>
                    </Flex>
                    <Button as={Link} to={`/game/${lobbyCode}`} colorScheme="blue">
                        New Game
                    </Button>
                </div>

            );
    }



}
export default EndScreen
