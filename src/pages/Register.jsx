import React, { useState } from "react"
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormHelperText,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { Form, redirect } from "react-router-dom"

export async function action({ request }) {
    const data = await request.formData()
    const username = data.get("username")
    const password = data.get("password")

    console.log({username, password})

    return redirect("/lobby")
}

export default function Register() {
  const [show, setShow] = useState(false)

  const handleClick = () => setShow(!show)

  return (
    <div className="">
      <Box maxW="480px">
        <Form method="post" action="/register">
          <FormControl mb="40px" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="Enter username..."
            />
            <FormHelperText>Choose a cool name Comrade</FormHelperText>
          </FormControl>

          <FormControl mb="40px" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                placeholder="Enter password..."
                type={show ? "text" : "password"}
              />
              <InputRightElement width="4.5rem">
                <Button onClick={handleClick} h="1.75rem" size="sm">
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button type="submit">signup</Button>
        </Form>
      </Box>
    </div>
  )
}
