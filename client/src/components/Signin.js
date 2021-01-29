import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Heading, Button, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import { setToken } from '../utils';
//import { Redirect } from 'react-router-dom';
//import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:1337";
//const strapi = new Strapi(apiUrl);
const graphqlApiUrl = process.env.REACT_APP_GRAPHQL_API_URL || apiUrl + "/graphql"

const Signin = (props) => {
  const [signin, setSignin] = useState(
    {
      email: "",
      password: "",
      jwt: ""
    }
  );

  const [toastState, setToastState] = useState(
    {
      toast: false,
      toastMessage: ""
    }
  );

  const [loading, setLoading] = useState(false);

  const userLoginMutation = ({ email, password }) => {
    const USER_SIGN_IN = `mutation {
      login(input: { identifier: "${email}", password: "${password}"}) {
        jwt
      }
    }`;

    console.log("email: ", email);
    console.log("password: ", password);

    //var queryResult;
  
    axios.post(
        graphqlApiUrl, {
        query: USER_SIGN_IN
    }).then((response) => {
        console.log("Fetch Data: ", response);
        setSignin.jwt = response.data.data.login.jwt;
        console.log("jwt: ", setSignin.jwt);
    }, (error) => {
        console.log(error);
    });
    
    // fetchData().then((response) => {
    //   console.log("Fetch Data: ", response);
    //   return response;      
    // });
    //console.log("queryResult: ", queryResult)
    // fetchData().then((response) => {
    //   console.log("Fetch Data: ", response);
    //   return response;      
    // });
    // queryResult = fetchData();
    // console.log("queryResult: ", queryResult)
    // return null;
  };

  const handleChange = ({ event, value }) => {
    event.persist();
    const updatedSignin = signin;
    setSignin({ ...updatedSignin, [event.target.name]: value })
  }

  const isFormEmpty = ({ email, password }) => {
    return !email || !password;
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

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormEmpty(signin)) {
      showToast("Filled in all fields");
      return;
    }
    console.log("Submitted!");
    // Sign up user
    try {
      // set loading true
      setLoading(true);
      // make request to register user with strapi
      // const response = await strapi.login(
      //   signup.username,
      //   signup.password,
      // )

      // Query graphql with axios, will return a promise, then to capture the results
      // const response = userLoginMutation(signin);
      userLoginMutation(signin);
      setLoading(false);
      // put token (to manage user session) in local storage
      console.log("Response: ", signin.jwt);
      setToken(signin.jwt);
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
          backgroundColor: "#d6b3a1"
        }
      }}
        margin={4}
        padding={4}
        shape="rounded"
        display="flex"
        justifyContent="center">
        {/* Sign in form */}
        <form style={{
          display: 'inlineBlock',
          textAlign: 'center',
          maxWidth: 450
        }}
          onSubmit={handleSubmit}>
          {/* Sign in form heading */}
          <Box
            marginBottom={2}
            display="flex"
            direction="column"
            alignItems="center">
            <Heading color="midnight">Welcome back!</Heading>
            {/* Strapi (v3.4.5) graphql uses Email input as identifier */}
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
          <Button inline disabled={loading} color="blue" text="Sign In" type="submit" />
        </form>
      </Box>
      <ToastMessage show={toastState.toast} message={toastState.toastMessage} />
    </Container>
  );
}

export default Signin;