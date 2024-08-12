import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SlideDrawer from "../component/miscellaneous/SlideDrawer"; // Adjust the import path as needed
import MyChats from "../component/miscellaneous/MyChats";
import ChatBox from "../component/miscellaneous/ChatBox";
import { Box } from "@chakra-ui/react";

const Chatepage = () => {
  const { user } = ChatState(); // Destructure user from the context
  const [fetchAgain,setFetchAgain]=useState();

  return (
    <div style={{ width: "100%", color: "white" }}>
      {user && <SlideDrawer />}
      <Box display="flex" justifyContent="space-between">
        {user && <MyChats fetchAgain={fetchAgain } setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};

export default Chatepage;
