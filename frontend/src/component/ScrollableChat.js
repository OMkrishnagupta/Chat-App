import React, { useEffect, useRef } from "react";
import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box display="flex" flexDirection="column" flex="1" overflowY="auto">
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => {
            const showAvatar =
              (isSameSender(messages, m, i, user.id) ||
                isLastMessage(messages, i, user.id)) &&
              m.sender._id !== user.id;

            return (
              <Box
                key={m._id}
                display="flex"
                alignItems="flex-end"
                flexDirection={m.sender._id === user.id ? "row-reverse" : "row"}
                mb={1}
              >
                {showAvatar && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={2}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
                <Box
                  backgroundColor={
                    m.sender._id === user.id ? "#BEE3F8" : "#B9F5D0"
                  }
                  ml={
                    showAvatar ? isSameSenderMargin(messages, m, i, user.id) : 0
                  }
                  mt={isSameUser(messages, m, i, user.id) ? 3 : 10}
                  borderRadius="20px"
                  px={3}
                  py={2}
                  maxWidth="75%"
                  display="flex"
                  alignItems="center"
                >
                  {m.content}
                </Box>
              </Box>
            );
          })}
        <div ref={messagesEndRef} /> {/* This is the scroll anchor */}
      </ScrollableFeed>
    </Box>
  );
};

export default ScrollableChat;
