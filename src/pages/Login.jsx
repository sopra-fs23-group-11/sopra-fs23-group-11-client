import { React, useState } from "react"
import { Link, useActionData, Form, redirect } from "react-router-dom"

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
import User from "../models/User"

/**the action is called once the user clicks on "sign up". 
 * As stated in the react router documentation its use case is for form validation 
 * with the addition of the useActionData hook
 * **/
export async function action({ request }) {
  const data = await request.formData()
  const username = data.get("username")
  const password = data.get("password")

  try {
    const response = await api.put(
      "/users",
      JSON.stringify({ username, password })
    )
    if(response.status === 202){
      const user = new User(response.data)
      sessionStorage.setItem("user", JSON.stringify(user))
      return redirect("/lobby")
    } 
  } catch (err) {
    return err.response.data
  }

  return null
}

export default function Login() {
  const [show, setShow] = useState(false)
  const errors = useActionData()

  const handleClick = () => setShow(!show)

  return (
    <div>
      <Box maxW="480px">
      {errors?.errorMessage && <Text color="red.500">{errors.errorMessage}</Text>}
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
