import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [picLoading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (pic !== null) {
      console.log("Pic URL:", pic);
    }
  }, [pic]);

  const postDetails = (files) => {
    setLoading(true);

    if (!files || files.length === 0) {
      toast({
        title: "Account creation failed.",
        description: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    const file = files[0];

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app"); // Replace with your upload preset
      formData.append("cloud_name", "Omkrishna"); // Replace with your cloud name

      fetch("https://api.cloudinary.com/v1_1/Omkrishna/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          if (data.url) {
            setPic(data.url.toString());
          } else {
            throw new Error("Image URL not found in response");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          setLoading(false);
          toast({
            title: "Upload failed.",
            description: "Could not upload image.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    } else {
      toast({
        title: "Invalid file type.",
        description: "Please select a valid image file (JPEG/PNG).",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword || !pic) {
      toast({
        description: "Please fill all the field",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }
    if(password!==confirmPassword){
       toast({
         description: "ConfirmPassword does not match with Password ",
         status: "Warning",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       return;

    }
      try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="8px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          placeholder="Upload a Picture"
          onChange={(e) => postDetails(e.target.files)}
        />
      </FormControl>
      <Button
        mt="30px"
        colorScheme="blue"
        width="100%"
        onClick={handleClick}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
