import {Grid, GridItem, Text} from "@chakra-ui/react";

function MyField() {
    const gridSize = 10;
    const cellSize = "25px";


    const cells = Array(gridSize * gridSize)
        .fill()
        .map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            return { x, y };
        });

    return (
        <div><Text fontSize='xl'>your Ships</Text>
        <div>
        <Grid
            templateColumns={`repeat(${gridSize}, ${cellSize})`}
            templateRows={`repeat(${gridSize}, ${cellSize})`}
            gap={0.5}
        >
            {cells.map(({ x, y }) => (
                <GridItem
                    key={`${x},${y}`}
                    bg="blue.500"
                    border="1px solid black"
                    w={cellSize}
                    h={cellSize}
                />
            ))}
        </Grid></div>
            </div>
    );
}
export default MyField;