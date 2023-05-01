import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components"
import "../styles/Global.css"

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
  <>
    <GlobalStyles />
    <CartContextProvider>
      <Component {...pageProps} />  
    </CartContextProvider>
  </>
)
}
