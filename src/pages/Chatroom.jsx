import { Box, Button, Input, ListItem, UnorderedList, Flex } from "@chakra-ui/react"
import BattleshipBoard from "../components/BattleShipBoard"
import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
// import SockJS from "sockjs-client"
// import { over } from "stompjs"
import { Stomp } from "stompjs/lib/stomp"
import {Link} from "react-router-dom";

let stompClient = null
const Chatroom = () => {
  const [privateChats, setPrivateChats] = useState(new Map())
  const [publicChats, setPublicChats] = useState([])
  const [tab, setTab] = useState("CHATROOM") 
  const [shots, setShots] = useState([])
  const {lobbyCode} = useParams()
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  })
  useEffect(() => {
    console.log(userData)
    console.log(shots)
  }, [userData])

  

  const connect = () => {
    // let Sock = new SockJS("http://localhost:8080/ws")
    // stompClient = over(Sock)
    stompClient = Stomp.client("ws://localhost:8080/ws")
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    setUserData({ ...userData, connected: true })
    stompClient.subscribe(`/chatroom/${lobbyCode}`, onMessageReceived)
    stompClient.subscribe(`/shot-simple`, onShotReceived)
    stompClient.subscribe(`/game/${lobbyCode}`, onJoin)
    // stompClient.subscribe(
    //   "/user/" + userData.username + "/private",
    //   onPrivateMessage
    // )
    userJoin()
  }

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    }
    stompClient.send(`/app/lobby/${lobbyCode}/message`, {}, JSON.stringify(chatMessage))
  }

  const onJoin = (payload) => {
    const payloadData = JSON.parse(payload.body)
    console.log(payloadData)
  }

  const onShotReceived = (payload) => {
    const payloadData = JSON.parse(payload.body)
    console.log(payloadData)
    shots.push(payloadData)
    setShots([...shots])
  }

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body)
    console.log(payloadData)
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, [])
          setPrivateChats(new Map(privateChats))
        }
        break
      case "MESSAGE":
        publicChats.push(payloadData)
        setPublicChats([...publicChats])
        break
    }
  }



  const onError = (err) => {
    console.log(err)
  }

  const handleMessage = (event) => {
    const { value } = event.target
    setUserData({ ...userData, message: value })
  }
  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      }
      console.log(chatMessage)
      stompClient.send(`/app/lobby/${lobbyCode}/message`, {}, JSON.stringify(chatMessage))
      setUserData({ ...userData, message: "" })
    }
  }


  const handleUsername = (event) => {
    const { value } = event.target
    setUserData({ ...userData, username: value })
  }

  const registerUser = () => {
    connect()
  }
  return (
    <Box className="container">
      {/* <Flex justifyContent="space-around" alignItems="center">
            <BattleshipBoard  socket={stompClient}/> 
            <BattleshipBoard socket={stompClient}/>
        </Flex> */}
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <UnorderedList>
              <ListItem
                onClick={() => {
                  setTab("CHATROOM")
                }}
                className={`member ${tab === "CHATROOM" && "active"}`}
              >
                Chatroom
              </ListItem>
              {[...privateChats.keys()].map((name, index) => (
                <ListItem
                  onClick={() => {
                    setTab(name)
                  }}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </ListItem>
              ))}
            </UnorderedList>
          </div>
          {tab === "CHATROOM" && (
            <div className="chat-content">
              <UnorderedList className="chat-messages">
                {publicChats.map((chat, index) => (
                  <ListItem
                    className={`message ${
                      chat.senderName === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </ListItem>
                ))}
              </UnorderedList>
              <UnorderedList>
                {shots.map((shot, index) =>(
                  <ListItem key={index}>
                    {shot.position}
                  </ListItem>
                ))}
              </UnorderedList>

              <div className="send-message">
                <Input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <Button
                  type="button"
                  className="send-button"
                  onClick={sendValue}
                >
                  send
                </Button>
              </div>
            </div>
          )}
          {tab !== "CHATROOM" && (
            <div className="chat-content">
              <UnorderedList className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <ListItem
                    className={`message ${
                      chat.senderName === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </ListItem>
                ))}
              </UnorderedList>

              <div className="send-message">
                <Input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <Button
                  type="button"
                  className="send-button"
                  // onClick={sendPrivateValue}
                >
                  send
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <Input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
          />
          <Button type="button" onClick={registerUser}>
            connect
          </Button>
          <Button as={Link} to={`/game/${lobbyCode}`} colorScheme="blue">
            back
          </Button>
        </div>
      )}
    </Box>

  )
}

export default Chatroom
