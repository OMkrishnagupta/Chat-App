import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';
const ENDPOINT="http://localhost:5000";
var socket ,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat ,notification,setNotification} = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
 const [SocketConnected,setSocketConnected]=useState(false);
 const [typing,setTyping]=useState(false);
const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(true));
    
  }, []);
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat",selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(()=>{
    socket.on("message recieved",(newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id)
      {
       if (!notification.includes(newMessageReceived)) {
         setNotification([newMessageReceived, ...notification]);
        //  setFetchAgain(!fetchAgain);
       }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
      

  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat;
  }, [selectedChat,]);
   
 

  const sendMessage = async () => {
    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
         socket.emit("new messages", data);
         console.log("hello kaise ho",data)
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!SocketConnected)return;
    if(!typing){{
      setTyping(true);
      socket.emit("typing",selectedChat._id)
    }}
    var lastTypingTime=new Date().getTime();
    var timmerLength=3000;
    setTimeout(() => {
      
    var timeNow = new Date().getTime();
    var timeDifference=timeNow-lastTypingTime;
    }, timmerLength);
  };

  const getOtherUser = () => {
    if (selectedChat && selectedChat.users) {
      console.log("Selected Chat Users:", selectedChat.users);
      console.log("Logged User ID:", user.id);

      // Log the ID of each user for debugging
      selectedChat.users.forEach((u) => {
        console.log(`User ID: ${u._id}`);
      });

      // Find the user whose ID does not match the logged-in user's ID
      const otherUser = selectedChat.users.find((u) => {
        console.log(`Comparing ${u._id} with ${user.id}`);
        return u._id !== user.id;
      });

      console.log("Other User Found:", otherUser);
      return otherUser;
    }
    return null;
  };

  const otherUser = getOtherUser();
  console.log("Final Other User:", otherUser);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            color="black"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Text fontFamily={"sans-serif"}>
                  {otherUser ? otherUser.name : "Unknown User"}
                </Text>
                {otherUser && <ProfileModal user={otherUser} />}
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            bg="#E8E8E8"
            w="100%"
            h="90%"
            borderRadius="lg"
            p={3}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box flex="1" overflowY="auto" mb={3} className="messages">
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl id="first-name" isRequired mt={3}>
              <Box display="flex" alignItems="center">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  mr={2}
                />
                <Button
                  color="white"
                  onClick={sendMessage}
                  sx={{
                    backgroundColor: "rgb(130,69,252)",
                    "&:hover": {
                      backgroundColor: "rgb(130,69,252)",
                    },
                    "&:active": {
                      backgroundColor: "rgb(130,69,252)",
                    },
                  }}
                >
                  Send
                </Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          h="100%"
          justifyContent="center"
        >
          <Text fontSize="3xl">Choose a user to chat with</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
