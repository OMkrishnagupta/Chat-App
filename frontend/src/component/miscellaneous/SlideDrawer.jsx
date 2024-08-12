import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Tooltip, Text, MenuButton, MenuItem, 
  MenuList, Menu, Avatar, useDisclosure, Drawer, 
  DrawerOverlay, DrawerContent, DrawerHeader, 
  DrawerCloseButton, DrawerBody, Input,
  useToast, Spinner
} from '@chakra-ui/react';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
const SlideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, chats, setChats, setSelectedChat,notification,setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter user name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      
      // Remove duplicates based on _id
      const uniqueData = data.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t._id === value._id
        ))
      );
      
      setLoading(false);
      setSearchResult(uniqueData); // Set unique data to state
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    console.log('Search Result Updated:', searchResult);
  }, [searchResult]);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
       const config = {
        "Content-type":"application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const{data}=await axios.post("/api/chat",{userId},config);
       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
       console.log(data)
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "error in fetching the chats",
        status: "error",
        description:error.messge,
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      
    }
  };

  return (
    <>
      <Box 
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
          <Button ref={btnRef} colorScheme='teal' onClick={onOpen} variant="ghost">
            <SearchIcon color="black" />
            <Text display={{ base: "none", md: "flex" }} fontSize="20px" padding="5px" color="black">
              Search
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="3xl" fontFamily="Work sans" color="black" fontWeight="bold">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
               <NotificationBadge 
              count={notification.length}
              effect={Effect.SCALE}/>
              <BellIcon fontSize="2xl" m={1} color="black" />
            </MenuButton>
             <MenuList color={'black'} pl={2}>
             
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList color="black">
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text fontSize="2xl" paddingLeft="10px">Search Users</Text>
          </DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                value={search}
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.length === 0 ? (
                <Text>No results found</Text>
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SlideDrawer;
