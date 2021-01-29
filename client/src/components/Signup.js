import React, { useState } from 'react';
import { Container, Box, Heading, Button, Text, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import { setToken } from '../utils';
//import { Redirect } from 'react-router-dom';
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const Signup = (props) => {
  const [signup, setSignup] = useState(
    {
      username: "",
      email: "",
      password: ""
    }
  );

  const [toastState, setToastState] = useState(
    {
      toast: false,
      toastMessage: ""
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = ({ event, value }) => {
    event.persist();
    const updatedSignup = signup;
    setSignup({ ...updatedSignup, [event.target.name]: value })
  }

  const isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  }

  const resetToastState = () => {
    const preToastState = toastState;
    setToastState(...preToastState, { toast: false, toastMessage: "" });
  }

  const showToast = textMessage => {
    const preToastState = toastState;
    setToastState(...preToastState, { toast: true, toastMessage: textMessage })
    setInterval(() => resetToastState(), 5000);
  }

  const redirectUser = path => props.history.push(path);

  const handleSubmit = async event => {
    event.preventDefault();
    if (isFormEmpty(signup)) {
      showToast("Filled in all fields");
      return;
    }
    console.log("Submitted!");
    // Sign up user
    try {
      // set loading true
      setLoading(true);
      // make request to register user with strapi
      const response = await strapi.register(
        signup.username,
        signup.email,
        signup.password,
      )
      // set loading false
      setLoading(false);
      // put token (to manage user session) in local storage
      console.log(response);
      setToken(response.jwt);
      // redirect user to home page
      redirectUser('/');
    } catch (err) {
      // set loading to false
      setLoading(false);
      // show error message with toast message
      showToast(err.message);
      console.log(err);
    }
  }

  return (
    <Container>
      <Box dangerouslySetInlineStyle={{
        __style: {
          backgroundColor: "#ebe2da"
        }
      }}
        margin={4}
        padding={4}
        shape="rounded"
        display="flex"
        justifyContent="center">
        {/* Sign Up form */}
        <form style={{
          display: 'inlineBlock',
          textAlign: 'center',
          maxWidth: 450
        }}
          onSubmit={handleSubmit}>
          {/* Signup form heading */}
          <Box
            marginBottom={2}
            display="flex"
            direction="column"
            alignItems="center">
            <Heading color="midnight">Let's Get Started</Heading>
            <Text italic color="orchid">Sign up to order some brews!</Text>
            {/* Username input  */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
            {/* Email input  */}
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />
            {/* Password input  */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </Box>
          <Button inline disabled={loading} color="blue" text="Submit" type="submit" />
        </form>
      </Box>
      <ToastMessage show={toastState.toast} message={toastState.toastMessage} />
    </Container>
  );
}

export default Signup;