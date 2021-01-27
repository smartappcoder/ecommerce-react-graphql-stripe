import React from 'react';
import {ClimbingBoxLoader} from 'react-spinners';
//import { GridLoader } from "react-spinners";
import { Box } from 'gestalt';

const Loader = ({ show} ) => 
    show && (<Box
        position="fixed"
        dangerouslySetInlineStyle={{
            __style: {
                bottom: 300,
                left: "50%",
                transform: "translateX(-50%)"
            }
        }}
    >
        <ClimbingBoxLoader size={15} color="#4A88E2" />
        { /* <GridLoader color="#4A88E2" size={25} margin="3px" /> */ }
    </Box>
);

export default Loader;