import React, { useState, useEffect } from "react"
import ship_loser1 from "../assets/ship_loser1.jpg"
import ship_winner from "../assets/ship_winner.png"
import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import {api} from "../helpers/api.js";
import {useParams, Link} from "react-router-dom";



function EndScreen() {
    const [user, setUsers] = useState(null);
    const hostId = localStorage.getItem("hostId")
    let [winner, setWinner] = useState(null);
    let [loser, setLoser] = useState(null);
    const { lobbyCode } = useParams();


    useEffect(() => {
            async function fetchData() {
                try {
                    const response = await api.get('/board/' + hostId)
                    const response1 = await api.get('/users/' + hostId)
                    const response2 = await api.get('/users')
                    setUsers(response2)
                    let joinId = response2.data[1].id
                    if (joinId == hostId) {
                        joinId = response2.data[0].id
                    }
                    const response3 = await api.get('/users/' + joinId)
                    console.log(response1)
                    const shipsRemaining = response.data.shipsRemaining
                    console.log(shipsRemaining)
                    if (shipsRemaining == 0) {
                         setLoser(response1.data.username)
                        setWinner(response3.data.username)
                    }else{
                        setWinner(response1.data.username)
                        setLoser(response3.data.username)
                    }

                } catch (error) {
                    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the users! See the console for details.");
                }
            }

            fetchData();
        },
        []);



    return (
        <div>
            <Flex alignItems="center" justifyContent="center">
            <Box textAlign="center">
                <Text Text as='b' fontSize='2xl' mt={4}>You won {winner}</Text>
                <Image src={ship_winner} alt="Image 1" boxSize="500px"/>
            </Box>

            <Box textAlign="center">
                <Text Text as='b' fontSize='2xl' mt={4}>You lost {loser}</Text>
                <Image src={ship_loser1} alt="Image 2" boxSize="500px" />
            </Box>
        </Flex>
            <Button as={Link} to={`/game/${lobbyCode}`} colorScheme="blue">
                New Game
            </Button>
        </div>

    );
}
export default EndScreen
