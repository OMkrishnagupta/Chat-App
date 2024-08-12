import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from '../SingleChat';

const ChatBox = (fetchAgain,setFetchAgain) => {
  const { selectedChat } = ChatState(); // Destructure selectedChat from ChatState

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }} // Show full screen on small screens if a chat is selected
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      h="90vh"
      w={{ base: "100%", md: "68%" }} // Take full width on small screens when a chat is selected
      borderRadius="lg"
      borderWidth="1px"
      m="5px"
      ml="5px"
      color="black"
    >
     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></SingleChat>
    </Box>
  );
};

export default ChatBox;
