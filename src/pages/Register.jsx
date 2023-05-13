import React, { useState } from "react"
import AvatarList from "../components/AvatarList"
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
  Flex,
} from "@chakra-ui/react"
import { Form, redirect, useActionData } from "react-router-dom"
import { api } from "../helpers/api"
import User from "../models/User"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")
  const avatar = sessionStorage.getItem("avatar")
  try {
    const response = await api.post(
      "/users",
      JSON.stringify({ username, password, avatar })
    )
    if (response.status === 201) {
      const user = new User(response.data)
      sessionStorage.setItem("userId", user.id) //for fetching userInfo
      localStorage.setItem("token", user.token) //for authentication
      return redirect("/lobby")
    }
  } catch (err) {
    return err.response.data
  }

  return null
}
export default function Register() {
  const [show, setShow] = useState(false)
  const errors = useActionData()
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  const handleSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl)
    sessionStorage.setItem("avatar", avatarUrl)
  }

  const handleClick = () => setShow(!show)

  const isSignupDisabled = !selectedAvatar
  return (
    <>
      {errors?.errorMessage && (
        <Text color="red.500">{errors.errorMessage}</Text>
      )}

      <Form method="post" action="/register">
        <Flex direction="row" alignItems="center" w="100%">
          <Box mb="40px"  minW="250px">
            <FormControl my="4" pl="20" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                placeholder="Choose a cool name Admiral!"
              />
            </FormControl>
            <FormControl my="4" pl="20" isRequired>
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
            <FormControl my="4" pl="20">
              <Button type="submit" w="100%" isDisabled={isSignupDisabled}>
                signup
              </Button>
            </FormControl>
          </Box>
          <AvatarList onSelect={handleSelect} selectedAvatar={selectedAvatar} />
        </Flex>
      </Form>
    </>
  )
}
