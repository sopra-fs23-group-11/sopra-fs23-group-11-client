import { React, useState } from "react"
import { Link, useActionData, Form, useNavigate } from "react-router-dom"

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react"

import { api } from "../helpers/api"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")

  try {
    const response = await api.put(
      "/users",
      JSON.stringify({ username, password })
    )
    return response
  } catch (err) {
    return {
      error: err.response.data.message,
    }
  }
}

export default function Login() {
  const [show, setShow] = useState(false)
  const response = useActionData()
  const navigate = useNavigate()
  console.log(response?.data)
  const handleClick = () => setShow(!show)

  if (response?.data?.token) navigate("/lobby")
  return (
    <div>
      <Box maxW="480px">
        {response?.error && <Text color="red.500">{response.error}</Text>}
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
