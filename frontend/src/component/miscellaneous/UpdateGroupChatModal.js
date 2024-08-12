import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({
  fetchAgain = false,
  setFetchAgain = () => {}, fetchMessages
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (user1) => {
    console.log("user1:", user1);
    console.log("Logged-in User:", user);
    console.log("Selected Chat:", selectedChat);

    // Ensure user1 has the correct ID property
    console.log("User to Remove ID:", user1._id || user1.id);

    // Use the correct ID for comparison
    const isAdmin =
      selectedChat.groupAdmin._id?.toString() === user.id?.toString();
    const isCurrentUser =
      (user1._id || user1.id)?.toString() === user.id?.toString();

    if (!isAdmin && !isCurrentUser) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id || user1.id, // Use the correct ID property here
        },
        config
      );

      user1._id === user.id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain); // This should work if setFetchAgain is a function
      setLoading(false);
    } catch (error) {
      console.error("Error removing user:", error);
     
      setLoading(false);
    }

    setGroupChatName("");
  };


  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      const { data } = response;
      if (data && data._id) { 
        setSelectedChat(data);

        // Ensure setFetchAgain is a function
        if (typeof setFetchAgain === "function") {
          setFetchAgain(!fetchAgain);
          fetchMessages();
          
        } else {
          console.warn("setFetchAgain is not a function");
        }
      } else {
        throw new Error("Unexpected API response format.");
      }
    } catch (error) {
      console.error("Rename error:", error);

      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setRenameLoading(false);
    }

    setGroupChatName("");
  };
  const handleAddUser = async (user1) => {
    // Log the `selectedChat` and `user` to confirm they contain the expected data
    console.log("Selected Chat Object:", selectedChat);
    console.log("Logged-in User Object:", user);

    // Check if `selectedChat` and its properties exist
    if (!selectedChat || !selectedChat.groupAdmin || !user) {
      console.error("Selected Chat, Group Admin, or User is missing.");
      toast({
        title: "Error",
        description: "Required information is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // Ensure the IDs are valid and compare them
    const groupAdminId = selectedChat.groupAdmin._id; // Ensure `groupAdmin` has `_id`
    const loggedInUserId = user.id; // Use `id` for the logged-in user

    if (!groupAdminId || !loggedInUserId) {
      console.error("Group Admin ID or User ID is missing.");
      toast({
        title: "Error",
        description: "Unable to determine admin or user ID.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (groupAdminId.toString() !== loggedInUserId.toString()) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // Check if the user is already in the group
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain((prev) => !prev); // Toggle fetchAgain
      setLoading(false);
    } catch (error) {
     console.log(error)
      ;
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton color="black" icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => {handleRemove(user);onClose()}
            } bg="red" color="white">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
