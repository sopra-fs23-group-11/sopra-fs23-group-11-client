import { Box, Button, Input, ListItem, UnorderedList } from "@chakra-ui/react"
import React, { useState, useEffect } from "react"
// import SockJS from "sockjs-client"
// import { over } from "stompjs"
import { Stomp } from "stompjs/lib/stomp"

let stompClient = null
const Chatroom = () => {
  const [privateChats, setPrivateChats] = useState(new Map())
  const [publicChats, setPublicChats] = useState([])
  const [tab, setTab] = useState("CHATROOM")
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  })
  useEffect(() => {
    console.log(userData)
  }, [userData])

  const connect = () => {
    // let Sock = new SockJS("http://localhost:8080/ws")
    // stompClient = over(Sock)
    stompClient = Stomp.client("ws://localhost:8080/ws")
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    setUserData({ ...userData, connected: true })
    stompClient.subscribe("/chatroom/public", onMessageReceived)
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
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage))
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

  // const onPrivateMessage = (payload) => {
  //   console.log(payload)
  //   var payloadData = JSON.parse(payload.body)
  //   if (privateChats.get(payloadData.senderName)) {
  //     privateChats.get(payloadData.senderName).push(payloadData)
  //     setPrivateChats(new Map(privateChats))
  //   } else {
  //     let list = []
  //     list.push(payloadData)
  //     privateChats.set(payloadData.senderName, list)
  //     setPrivateChats(new Map(privateChats))
  //   }
  // }

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
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage))
      setUserData({ ...userData, message: "" })
    }
  }

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      }

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage)
        setPrivateChats(new Map(privateChats))
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage))
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
                  onClick={sendPrivateValue}
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
        </div>
      )}
    </Box>
  )
}

export default Chatroom
