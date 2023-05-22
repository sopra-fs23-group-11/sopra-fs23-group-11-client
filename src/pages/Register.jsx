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
import { Form, redirect, useActionData, Link, useNavigation } from "react-router-dom"
import { api } from "../helpers/api"
import User from "../models/User"
import AnimationContainer from "../components/AnimationContainer"
import { lobbyVariants } from "../animations/variants"

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
  const navigation = useNavigation()
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [password, setPassword] = useState("")

  const handleSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl)
    sessionStorage.setItem("avatar", avatarUrl)
  }

  const handleClick = () => setShow(!show)

  const isSignupDisabled = !selectedAvatar
  return (
    <AnimationContainer variants={lobbyVariants}>
      <Flex
        pt={10}
        alignItems = "center"
        justifyContent="center"
        flexDirection="column"
      >

      <Flex justifyContent= "flex-start">
      {errors?.errorMessage && (
        <Text color="red.500" my='4' textAlign="left" fontSize= "lg">
          {errors.errorMessage}
        </Text>
      )}
      </Flex>

      <Form method="post" action="/register">
        <Flex direction="row" alignItems="center" w="100%">
          <Box mb="40px"  minW="250px" mr= "20">
            <FormControl my="4"  isRequired>
              <FormLabel fontSize = "lg" >Username</FormLabel>
              <Input
                type="text"
                name="username"
                placeholder="Choose a cool name, Admiral!"
              />
            </FormControl>
            <FormControl my="4"  isRequired>
              <FormLabel fontSize = "lg">Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  placeholder="Enter password..."
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  {password && <Button onClick={handleClick} h="1.75rem" size="sm" variant="brand">
                    {show ? "Hide" : "Show"}
                  </Button>}
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl my="4" >
              <Button type="submit" w="100%" isDisabled={isSignupDisabled || navigation.state === "submitting"} variant="brand">
                {navigation.state === "submitting" ? "Submitting..." : "Sign up"}
              </Button>
            </FormControl>

            <Box color="teal.400" textDecoration="underline">
            <Link to="../login"> Have an account? Log in here.</Link>
            </Box>

          </Box>

          <FormControl isRequired>

          <Text  as="b" >You need to select an Avatar to play!</Text>
          <AvatarList onSelect={handleSelect} selectedAvatar={selectedAvatar} />
          </FormControl>

        </Flex>
      </Form>
        </Flex>
    </AnimationContainer>
  )
}
