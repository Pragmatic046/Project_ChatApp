import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Password, setPassword] = useState("");
  const [Picture, setPicture] = useState(null);
  const [Show, setShow] = useState(false);
  const [Loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleClick = () => {
    setShow(!Show);
  };

  // ------------------Post Details------------------------------
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "aaks123");
      fetch("https://api.cloudinary.com/v1_1/aaks123/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setPicture(data.url); //.toString()
            console.log("Picture: ", data.url); // .toString()
          } else {
            console.log("Failed to retrieve URL form response: ", data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  // ---------------Submit Handler-----------------------
  const submitHandler = async () => {
    console.log(Name, Email, Password, ConfirmPassword);
    setLoading(true);
    if (!Name || !Email || !Password || !ConfirmPassword) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (Password !== ConfirmPassword) {
      toast({
        title: "Password does not match!",
        status: "warning",
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
        "http://localhost:5000/user",
        {
          name: Name,
          email: Email,
          password: Password,
          pic: Picture,
        },
        config
      );
      toast({
        title: "Registration Successful!",
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
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  // ---------------------------------------------------------------
  return (
    <VStack spacing={"5px"}>
      <FormControl id="signup-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="signup-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Email@example"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="signup-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password"}
            placeholder="Choose Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button size={"xs"} onClick={handleClick}>
              {Show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={Show ? "text" : "password"}
          placeholder="Confirm Your Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Photo</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={Loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;