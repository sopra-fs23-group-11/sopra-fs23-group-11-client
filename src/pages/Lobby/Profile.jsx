import React, { useEffect, useState } from "react"
import { useNavigate} from "react-router-dom"
import { api, handleError } from "../../helpers/api"
import { Box, Button, Text} from "@chakra-ui/react";


const Profile = () => {
    const [username, setUsername] = useState(null);
    const [status, setStatus] = useState(null);
    const [id, setId] = useState(null);
    const [totalWins, setTotalWins] = useState(null);
    const user = JSON.parse(sessionStorage.getItem("user"))
    console.log(user)
    const navigate = useNavigate()

    const userInfo = async (id) =>{
        try{
            setUsername(user.username);
            setStatus(user.status);
            setId(user.id)
            setTotalWins(user.totalWins);
        }catch (error) {
            alert(`not working: \n${handleError(error)}`)
        }
    };

    const goBack = () => {
        navigate(`/lobby`)
    }

    let content = (
        <div className="game">
            <ul className="game user-list">
                <li> Account username: {user.username}</li>
                <li>Account ID: {user.id}</li>
                <li> Account Status: {user.status}</li>
                <li> Account Wins: {user.totalWins}</li>
            </ul>
        </div>
    )
    return (
        <div>
            <Button
                mt={4}
                width="10%"
                onClick={() => goBack()}
            >Back</Button>
            <Box>

            </Box>
            <Box textAlign="center">
                <Text as='bold' textAlign="center" fontSize='3xl'>Welcome to your Profile</Text>
                <Text fontSize='xl'>
                    This is your Information:
                </Text>
                <Box>{content}</Box>
            </Box>
        </div>
    )
}
export default Profile;