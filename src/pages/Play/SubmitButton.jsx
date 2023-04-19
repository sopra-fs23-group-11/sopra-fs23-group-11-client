import { useState } from "react";
import { Box, Flex, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

const SubmitButton = () => {
    const [x, setX] = useState("");
    const [y, setY] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Submitted coords: ${x}${y}`);
        // Sending Coordinates to Backend
    };

    const handleXChange = (event) => {
        setX(event.target.value.toUpperCase());
    };

    const handleYChange = (event) => {
        setY(event.target.value);
    };



    return (
        <Box position="fixed" left={0} p={4}>
            <form onSubmit={handleSubmit}>
                <FormControl id="x-coord" isRequired>
                    <FormLabel>Enter X coordinate:</FormLabel>
                    <Input type="text" maxLength={1} value={x} onChange={handleXChange} />
                </FormControl>
                <FormControl id="y-coord" isRequired>
                    <FormLabel>Enter Y coordinate:</FormLabel>
                    <Input type="number" min={1} max={10} value={y} onChange={handleYChange} />
                </FormControl>
                <Flex mt={4}>
                    <Button type="submit" colorScheme="red" mr={2}>BOOM!!!</Button>
                </Flex>
            </form>
        </Box>
    );
};

export default SubmitButton;
