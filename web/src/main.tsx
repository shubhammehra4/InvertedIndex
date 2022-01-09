import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { render } from "preact";
import App from "./App";
import "./index.css";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
});

render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")!
);
