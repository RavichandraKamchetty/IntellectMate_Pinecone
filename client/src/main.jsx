import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const styles = {
    global: (props) => ({
        body: {
            bg: mode("gray.100", "#000")(props),
            color: mode("gray.800", "whiteAlpha.900")(props),
        },
    }),
};

const config = {
    initialColorMode: "dark",
    useSystemColorMode: true,
};

const colors = {
    gray: {
        light: "#616161",
        dark: "#1e1e1e",
    },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
    <RecoilRoot>
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <SocketContextProvider>
                    <App />
                </SocketContextProvider>
            </ChakraProvider>
        </BrowserRouter>
    </RecoilRoot>
);
