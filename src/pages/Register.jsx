import React, { useState, useEffect } from "react"
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
import {Form, useActionData, useNavigate} from "react-router-dom"
import {api, handleError} from "../helpers/api"
import User from "../models/User"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")
  let avatar = data.get("avatar")

  try {
    const response = await api.post(
      "/users",
      JSON.stringify({ username, password, avatar })
    )
    return response
  } catch (err) {
    return {
      error: err.response.data.message,
    }
  }
}
function AvatarList() {
  const [avatar, setAvatar] = useState('');

  const avatars = [
    "https://api.dicebear.com/6.x/lorelei/svg?seed=1",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=2",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=3",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=4",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=5",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=6",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=7",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=8",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=9",
    "https://api.dicebear.com/6.x/lorelei/svg?seed=10",
  ];

  const handleAvatarClick = (index) => {
    setAvatar(avatars[index]);
    console.log(avatar)
  };


  return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {avatars.map((url, index) => (
            <img
                key={index}
                src={url}
                alt={`avatar-${index}`}
                style={{ width: '75px', height: '75px', margin: '10px', cursor: 'pointer' }}
                onClick={() => handleAvatarClick(index)}
            />
        ))}
      </div>
  );
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
            <Text>Choose your character!</Text>
            <Box><AvatarList /></Box>
            <Button type="submit">signup</Button>
          </Form>
        </Box>
      </div>
  )
}
