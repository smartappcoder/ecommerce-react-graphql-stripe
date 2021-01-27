import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from 'gestalt'
import { Link } from 'react-router-dom';
import Loader from './Loader';

import './App.css';

// const apiUrl = process.env.API_URL || "http://192.168.1.36:1337";
// const GRAPHQL_API = apiUrl + "/graphql"
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:1337";
const graphqlApiUrl = process.env.REACT_APP_GRAPHQL_API_URL || apiUrl + "/graphql"

console.log("App apiUrl", apiUrl);
console.log("App graphqlApiUrl", graphqlApiUrl);

const GET_BRANDS = `query Brand {
  brands {
    _id
    name
    description
    createdAt
    image {
      name
      mime
      url
    }
  }
}`;

//class App extends Component {
// constructor(props) {
//   super(props);

//   // State of your application
//   this.state = {
//     modifiedData: {
//       name: '',
//       description: '',
//       categories: [],
//     },
//     allCategories: [],
//     error: null,
//   };
// }
// componentDidMount = async () => {
//   axios({
//     url: 'http://192.168.1.36:1337/graphql',
//     method: 'post',
//     data: {
//       query: `
//           query Brand {
//             brands {
//               _id
//               name
//               description
//               createdAt
//               image {
//                 name
//                 mime
//                 url
//               }
//             }
//           }      
//       `
//     }
//   }).then((result) => {
//     console.table(result.data)
//   }).catch(error => {
//     console.log(error);
//   })
// }

function App() {
  // Store the users in a state variable.
  // We are passing an empty array as the default value.
  let [brands, setBrands] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  let [loadingBrand, setLoadingBrand] = useState(true);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const queryResult = await axios.post(
          graphqlApiUrl, {
          query: GET_BRANDS
        }
        );
        setBrands(queryResult.data.data.brands);
        setLoadingBrand(false);
      };
      fetchData();
    } catch(error) {
      console.log(error);
      setLoadingBrand(false)
    }
  }, []);  

  const filteredBrands = () => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }
 
  // get event.value directory
  const handleChange =({value} ) => {
    setSearchTerm(value);
    console.log("Search Term", searchTerm);
  };

  // Rendering
  console.table(brands);

  return (
    <Container>
      {/* Brand Search Field */}
      <Box display="flex" justifyContent="center" marginTop={4}>
        <SearchField 
          id="SearchField"
          accessibilityLabel="Brand Search Field"
          onChange={handleChange}
          value={searchTerm}
          placeholder="Search Brands"
        />
        <Box margin={3}>
          <Icon 
            icon="filter"
            color={searchTerm ? "orange" : "gray"}
            size={20}
            accessibilityLabel="Filter"
          />
        </Box>
      </Box>

      {/* Brand Section*/}
      <Box display="flex" justifyContent="center" marginBottom={2} >
        {/* Brand Headers */}
        <Heading color="midnight" size="md">
          Brew Brand
        </Heading>
      </Box>
      {/* Brands */}
      <Box         
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: "#d6c8ec"
          }
        }}
        shape="rounded"
        wrap display="flex" justifyContent="around">
        {filteredBrands().map(brand => (
          <Box paddingY={4} margin={2} width={200} key={brand._id} >
            <Card image={
              <Box height={200} width={200}>
                <Image
                  fit="cover"
                  alt="Brand"
                  naturalWidth={1}
                  naturalHeight={1}
                  src={`${apiUrl}${brand.image[0].url}`}
                />
                { console.log(`${brand.name}`)}
                { console.log(`${brand.description}`)}
                { console.log(`${brand.image[0].url}`)}
              </Box>
            }>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Text bold size="xl">{brand.name}</Text>
                <Text>{brand.description}</Text>
                <Text bold size="xl">
                  <Link to={`/${brand._id}`}>See Brew</Link>
                </Text>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
      { /* <Spinner show={loadingBrand} accessibilityLabel="Loading Spinner"/> */ }
      <Loader show={loadingBrand}/>
    </Container>
  );
}

export default App;