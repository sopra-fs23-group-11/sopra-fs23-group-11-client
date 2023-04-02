import { React, useState } from "react"
import { Link } from "react-router-dom"

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { Form, redirect } from "react-router-dom"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")

  console.log({ username, password })

  return redirect("/lobby")
}

export default function Login() {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <div>
      <Box maxW="480px">
        <Form method="post" action="/login">
          <FormControl mb="40px">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
            />
          </FormControl>

          <FormControl mb="40px">
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

          <Button type="submit">login</Button>
        </Form>
      </Box>
      <Box color="teal.400" textDecoration="underline">
        <Link to="../register">No account? Sign up here</Link>
      </Box>
    </div>
  )
}
