import { React, useState } from "react"
import {
  Link,
  useActionData,
  Form,
  redirect,
  useLocation,
  useNavigation,
} from "react-router-dom"

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Text,
  Container,
  Flex,
} from "@chakra-ui/react"
import { api } from "../helpers/api"
import User from "../models/User"
import AnimationContainer from "../components/AnimationContainer"
import { lobbyVariants } from "../animations/variants"

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
    if (response.status === 202) {
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

export default function Login() {
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState("")
  const errors = useActionData()
  const locaction = useLocation()
  const navigation = useNavigation()

  const handleClick = () => setShow(!show)

  return (
    <AnimationContainer variants={lobbyVariants}>
      <Container
        h="60vh"
        pt="4em"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Flex direction="column">
          <Box maxW="480px">
            {locaction.state?.message && (
              <Text color="red.500">{locaction.state.message}</Text>
            )}
            {errors?.errorMessage && (
              <Text color="red.500">{errors.errorMessage}</Text>
            )}
            <Form method="post" action="/login">
              <FormControl mb="40px" isRequired>
                <FormLabel fontSize="lg">Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                />
              </FormControl>

              <FormControl mb="40px" isRequired>
                <FormLabel fontSize="lg">Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    placeholder="Enter password..."
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    {password && (
                      <Button
                        onClick={handleClick}
                        h="1.75rem"
                        size="sm"
                        variant="brand"
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="100%"
                isDisabled={navigation.state === "submitting"}
                bgGradient="linear(to-l, #0172AF, #4FD1C5)"
                variant="brand"
              >
                {navigation.state === "submitting" ? "Loggin in..." : "Log in"}
              </Button>
            </Form>
          </Box>
          <Box color="teal.400" textDecoration="underline" mt="1em">
            <Link to="../register">No account? Sign up here</Link>
          </Box>
        </Flex>
      </Container>
    </AnimationContainer>
  )
}
