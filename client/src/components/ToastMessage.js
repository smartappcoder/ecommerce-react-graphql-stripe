import React from 'react';
import { Box, Toast } from 'gestalt';

const ToastMessage = ({ show, message }) => {
    if (show) {
        return (
            <Box
                dangerouslySetInlineStyle={{
                    __style: {
                        bottom: 250,
                        left: "50%",
                        transform: "translateX(-50%)"
                    }
                }}
                position="fixed" >
                <Toast color="orange" text={message} />
            </Box>
        )
    } else return null;
}

export default ToastMessage;