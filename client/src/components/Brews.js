import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Box, Heading, Image, Text, Card, Button, Mask, IconButton } from 'gestalt';
import { calculatePrice } from '../utils';

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:1337";
const graphqlApiUrl = process.env.REACT_APP_GRAPHQL_API_URL || apiUrl + "/graphql"

console.log("Brews apiUrl", apiUrl);
console.log("Brews graphqlApiUrl", graphqlApiUrl);

const Brews = (props) => {
    let [brand, setBrand] = useState("");
    let [brews, setBrews] = useState([]);
    let [cartItems, setCartItems] = useState([]);

    console.log("Brand Id: ", props.match.params.brandId);
    // Temp, WIP, just get going

    const addToCart = brew => {
        const alreadyInCart = cartItems.findIndex(item => item._id === brew._id);

        if (alreadyInCart === -1) {
            const updatedItems = cartItems.concat({
                ...brew,
                quantity: 1
            })
            setCartItems(updatedItems);
        } else {
            // https://stackoverflow.com/questions/58015602/how-to-rerender-component-in-useeffect-hook
            // Treat this.state as if it were immutable.
            // this.setState(prevState => ({
            //   arrayvar: [...prevState.arrayvar, newelement]
            // }))
            const updatedItems = cartItems.map((item) => {
                    if (item._id === brew._id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                });
            setCartItems(updatedItems);
        }
    }

    const deleteItemFromCart = itemToDeleteId => {
        const filteredItems = cartItems.filter(item => item._id !== itemToDeleteId);
        setCartItems(filteredItems);
    }

    useEffect(() => {
        const GET_BREWS_BY_BRAND = `query {
            brand(id:"${props.match.params.brandId}") {
                _id
                name
                brews {
                _id
                name
                description
                image {
                    url
                }
                price
                }
            }
        }`;

        try {
            const fetchData = async () => {
                const queryResult = await axios.post(
                    graphqlApiUrl, {
                    query: GET_BREWS_BY_BRAND
                }
                );
                setBrand(queryResult.data.data.brand.name);
                setBrews(queryResult.data.data.brand.brews);
                // setLoadingBrand(false);
            };
            fetchData();
        } catch (error) {
            console.log(error);
            //setLoadingBrand(false)
        }
    }, []);

    console.log("Brand: ", brand);
    console.table(brews);
    return (
        <Box
            marginTop={4}
            display="flex"
            justifyContent="center"
            alignItems="start"
            dangerouslySetInlineStyle={{
                __style: {
                    flexWrap: 'wrap-reverse'
                }
            }}
        >
            {/* Brew Section */}
            <Box display="flex" direction="column" alignItems="center">
                {/* Brew Heading */}
                <Box margin={2}>
                    <Heading color="navy">{brand}</Heading>
                </Box>
                {/* Brews */}
                <Box
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor: "#bdcdd9"
                        }
                    }}
                    wrap
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    padding={4}
                >
                    {brews.map(brew => (
                        <Box paddingY={4} margin={2} width={210} key={brew._id} >
                            <Card image={
                                <Box height={250} width={200}>
                                    <Image
                                        fit="cover"
                                        alt="Brew"
                                        naturalWidth={1}
                                        naturalHeight={1}
                                        src={`${apiUrl}${brew.image[0].url}`}
                                    />
                                    {console.log(`${brew.name}`)}
                                    {console.log(`${brew.description}`)}
                                    {console.log(`${brew.image[0].url}`)}
                                </Box>
                            }>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    direction="column"
                                >
                                    <Box marginBottom={2}>
                                        <Text bold size="xl">{brew.name}</Text>
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Text>{brew.description}</Text>
                                    </Box>
                                    <Text color="orange">${brew.price}</Text>
                                    <Box marginTop={2}>
                                        <Text bold size="xl">
                                            <Button onClick={() => addToCart(brew)} color="blue" text="Add to Cart" />
                                        </Text>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* User cart */}
            <Box alignSelf="end" marginTop={2} marginLeft={8}>
                <Mask shape="rounded" wash>
                    <Box display="flex" direction="column" alignItems="center" padding={2} >
                        {/* User Cart Heading */}
                        <Heading align="center" size="sm">Your Cart</Heading>
                        <Text color="eggplant" italic>
                            {cartItems.length} items selected
                        </Text>
                        {/* Cart Items */}
                        {cartItems.map(item => (
                            <Box key={item._id} display="flex" alignItems="center" >
                                <text>{item.name} x {item.quantity} = ${(item.quantity * item.price).toFixed(2)}</text>
                                <IconButton
                                    accessibilityLabel="Delete Item"
                                    icon="cancel"
                                    size="sm"
                                    iconColor="red"
                                    onClick={() => deleteItemFromCart(item._id)}
                                />
                            </Box>
                        ))}
                        <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                            <Box margin={2}>
                                {cartItems.length === 0 && (
                                    <Text color="red">Please select some items</Text>
                                )}
                            </Box>
                            <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                            <Text>
                                <Link to="/checkout">Checkout</Link>
                            </Text>
                        </Box>
                    </Box>
                </Mask>
            </Box>
        </Box>
    )
};

export default Brews;
