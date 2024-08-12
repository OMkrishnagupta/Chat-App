import React from 'react'
import { Box, Container,Text,Tab, Tabs,TabList,TabPanels,TabPanel } from '@chakra-ui/react'
import Login from '../component/Authentication/login'
import Singup from '../component/Authentication/singup'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const Homepage = () => {
      const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo){
       navigate("/");

    }
  });
  return (

    <Container maxW = 'xl' centercontent>
      <Box   
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
       <Text fontSize="4xl" fontFamily="Work sans">
          Talk Town 🧿
        </Text>
      </Box>
      <Box bg="white" p="4" w="100%" borderRadius="1g" borderWidth="1px">
       <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb='1em'
  >
    <Tab w="50%" > LogIn </Tab>
    <Tab w="50%" >SingUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
     <Login/>
    </TabPanel>
    <TabPanel>
      <Singup/>
    </TabPanel>
  </TabPanels>
</Tabs>

      </Box>

    </Container>

  )
}

export default Homepage