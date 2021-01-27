import React from 'react';
import { NavLink } from "react-router-dom";

import { Box, Text, Heading, Image } from 'gestalt';

const Navbar = () => (
    <Box 
        height={70}
        display="flex"
        alignItems="center"
        justifyContent="around"
        color="midnight"
        padding={1}
        shape="roundedBottom">

        { /* title and logo */}
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Box margin={2} height={50} width={50}>
                    <Image
                        alt="BIHahaha Logo"
                        naturalHeight={1}
                        naturalWidth={1}
                        src="./icons/logo.svg"
                    />
                </Box>
                <Heading size="xs" color="orange">
                    BIHahaha
            </Heading>
            </Box>
        </NavLink>

        { /* signin link */}
        <NavLink activeClassName="active" to="/signin">
            <Text size="xl" color="white">Sign In</Text>
        </NavLink>

        { /* signup link */}
        <NavLink activeClassName="active"  to="/signup">
            <Text size="xl" color="white">Sign Up</Text>
        </NavLink>

        { /* checkout link */}
        <NavLink activeClassName="active"  to="/checkout">
            <Text size="xl" color="white">Checkout</Text>
        </NavLink>
        Navbar
    </Box>
)

export default Navbar;