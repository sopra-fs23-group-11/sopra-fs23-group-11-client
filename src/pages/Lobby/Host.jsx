import React, {useEffect, useState} from 'react'
import {api, handleError} from "../../helpers/api.js";
import {Spinner, Text} from "@chakra-ui/react";


export default function Host() {
  const [code, setCode] = useState(null)
  const id = localStorage.getItem("userId")
  const host ={id}

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.post(
            "/host",
            JSON.stringify({host})
        )
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)

        // Get the returned users and update the state.
        setCode(response.data.lobbyCode);

        // See here to get more data.
        // console.log(response.data.lobbyCode);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData();
  }, [0]);
  return (
    <div>
      <div>Code is being generated...</div>
      <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
      />
      <Text>{code}</Text>
    </div>
  )
}
