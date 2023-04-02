import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@chakra-ui/react"

export default function Home() {
    return (
        <div>
            <h1>Welcome Comrade! Join our Battle NOW!</h1>
            <Button>
                <Link to="login">Join Now</Link>
            </Button>
        </div>
    )
}