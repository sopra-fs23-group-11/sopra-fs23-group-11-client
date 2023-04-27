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
  Text,
} from "@chakra-ui/react"
import { Form, useActionData, useNavigate } from "react-router-dom"
import { api } from "../helpers/api"
import User from "../models/User"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")

  try {
    const response = await api.post(
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

export default function Register() {
  const [show, setShow] = useState(false)
  const response = useActionData()
  const user = new User(response?.data)
  console.log(response?.data)
  sessionStorage.setItem("user", JSON.stringify(user))
  const navigate = useNavigate()
  const handleClick = () => setShow(!show)

  if (response?.data?.token) navigate("/lobby")
  return (
    <div className="">
      {response?.error && <Text color="red.500">{response.error}</Text>}
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
