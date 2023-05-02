import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components"
import "../styles/Global.css"
import { SessionProvider } from "next-auth/react";

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
  hr{
    display: block;
    border: 0;
    border-top: 1px solid #eee;
  }
`;

export default function App({ Component, pageProps: {session, ...pageProps} }) {
  return (
  <>
    <GlobalStyles />
    <SessionProvider session={session}>
      <CartContextProvider>
        <Component {...pageProps} />  
      </CartContextProvider>
    </SessionProvider>

  </>
)
}
