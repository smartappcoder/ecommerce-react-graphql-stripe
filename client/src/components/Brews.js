import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Heading, Image, Text, Card, Button } from 'gestalt';

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:1337";
const graphqlApiUrl = process.env.REACT_APP_GRAPHQL_API_URL || apiUrl + "/graphql"

console.log("Brews apiUrl", apiUrl);
console.log("Brews graphqlApiUrl", graphqlApiUrl);

const Brews = (props) => {
    let [brand, setBrand] = useState("");
    let [brews, setBrews] = useState([]);

    console.log("Brand Id: ", props.match.params.brandId);

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
        >
            {/* Brew Section */}
            <Box display="flex" direction="column" alignItems="center">
                {/* Brew Heading */}
                <Box margin={2}>
                    <Heading color="#4287f5">{brand}</Heading>
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
                                            <Button color="blue" text="Add to Cart" />
                                        </Text>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
};

export default Brews;
