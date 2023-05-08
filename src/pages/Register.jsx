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
  Text
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


  const handleSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl)
    sessionStorage.setItem('avatar', avatarUrl)
  }

  const handleClick = () => setShow(!show)



  return (
    <>
    {errors?.errorMessage && <Text color="red.500">{errors.errorMessage}</Text>}
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
            <Text>Choose your character!</Text>
            <AvatarList onSelect={handleSelect} selectedAvatar={selectedAvatar}/>
            <Button type="submit">signup</Button>
          </Form>
        </Box>
    </>
  )
}
