import React, {useState, useEffect} from 'react'
import {Button, Input} from '@chakra-ui/react'
import {api, handleError} from "../../helpers/api.js";

export default function Join() {
  const [code, setCode]  = useState("")
    console.log(code)

    function submitCode() {
        useEffect(() => {
            // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
            async function fetchData() {
                try {
                     await api.put(
                        "/join",
                        JSON.stringify({ username, code})
                    )
                    // delays continuous execution of an async operation for 1 second.
                    // This is just a fake async call, so that the spinner can be displayed
                    // feel free to remove it :)

                    // Get the returned users and update the state.

                    // See here to get more data.

                } catch (error) {
                    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the users! See the console for details.");
                }
            }
            fetchData();
        }, []);
    }

    return (
    <div><div>Enter Roomcode</div>
      <Input value={code} name="code" onChange={e => setCode(e.target.value)} htmlSize={4} width='auto' />
      <Button onClick={submitCode}>submit code</Button>
    </div>
  )
}
