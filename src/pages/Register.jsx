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
  Text, Avatar, Tooltip,
} from "@chakra-ui/react"
import {Form, useActionData, useNavigate} from "react-router-dom"
import {api, handleError} from "../helpers/api"
import User from "../models/User"

export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")
  let avatar = sessionStorage.getItem('avatar')
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
    "https://api.dicebear.com/6.x/lorelei/svg?seed="+ localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/adventurer/svg?seed="+ localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/avataaars/svg?seed="+ localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/bottts/svg?seed=" + localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/big-ears/svg?seed=" + localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/croodles/svg?seed=" + localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/open-peeps/svg?seed=" + localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/big-smile/svg?seed=" + localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/miniavs/svg?seed=" + localStorage.getItem('result'),
    "https://api.dicebear.com/6.x/pixel-art/svg?seed=" + localStorage.getItem('result'),
  ];

  const handleAvatarClick = (index) => {
    setAvatar(avatars[index]);
    console.log(index)
    sessionStorage.setItem('avatar', avatar)
  };

  function generateAvatar() {
    const minLength = 1; // minimum length of the code
    const maxLength = 10; // maximum length of the code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // possible characters in the code
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength; // random length between min and max length
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    localStorage.setItem('result', result);
  }


  return (
      <div><Button onClick={generateAvatar}>Generate Avatars</Button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {avatars.map((url, index) => (
            <Tooltip hasArrow label='Pick Me!'><Avatar
                size='xl'
                key={index}
                src={url}
                alt={`avatar-${index}`}
                onClick={() => handleAvatarClick(index)}
            /></Tooltip>
        ))}
      </div>
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
