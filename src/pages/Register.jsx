import React, { useState} from "react"
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
    Flex
} from "@chakra-ui/react"
import {Form, redirect, useActionData} from "react-router-dom"
import {api} from "../helpers/api"
import User from "../models/User"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")
  const avatar = sessionStorage.getItem('avatar')
  try {
    const response = await api.post(
      "/users",
      JSON.stringify({ username, password, avatar })
      )
    if(response.status === 201){
      const user = new User(response.data)
      console.log(user);
      sessionStorage.clear();
      localStorage.clear();
      sessionStorage.setItem("user", JSON.stringify(user))
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl)
    sessionStorage.setItem('avatar', avatarUrl)
  }

  const handleClick = () => setShow(!show)

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const isSignupDisabled = !selectedAvatar || !username || !password
  return (
    <>
    {errors?.errorMessage && <Text color="red.500">{errors.errorMessage}</Text>}

          <Form method="post" action="/register">

            <Flex direction="row" alignItems="center" w="100%">
              <FormControl mb="40px" isRequired w="30%">
                <FormControl my="4" pl="20">
                <FormLabel>Username</FormLabel>
                <Input
                    type="text"
                    name="username"
                    placeholder="Choose a cool name Admiral!"
                    value={username}
                    onChange={handleUsernameChange}
                />
                </FormControl>
                <FormControl my="4" pl="20">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                      name="password"
                      placeholder="Enter password..."
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button onClick={handleClick} h="1.75rem" size="sm">
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                  </FormControl>
                <FormControl my="4" pl="20">
                <Button type="submit" w="100%" isDisabled={isSignupDisabled}>signup</Button>
                </FormControl>
              </FormControl>

              <AvatarList onSelect={handleSelect} selectedAvatar={selectedAvatar} />
            </Flex>
          </Form>
    </>
  )
}
