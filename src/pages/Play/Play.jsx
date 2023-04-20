import MyField from "./MyField.jsx"
import SubmitButton from "./SubmitButton.jsx"
import React from "react";
import BattleshipBoard from "../../components/BattleShipBoard.jsx";
import Ships from "../../components/Ships.jsx";
import { Box } from "@chakra-ui/react";


function Play() {

    return (
        <Box>
            <BattleshipBoard/>
            <Ships/>
        </Box>

    );
}
export default Play;