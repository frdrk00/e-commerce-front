import styled from "styled-components";
import Center from "./Center";
import WhiteBox from "./Box";

const FooterWrapper = styled.div`
    margin: 40px 0;

`

export default function Footer() {
    return (
        <FooterWrapper>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"></link>
        <Center>
            <WhiteBox>
            <div class="footer-basic">
            <div class="social">
                <a href="#">
                <i class="icon ion-social-instagram"></i></a><a href="#">
                <i class="icon ion-social-snapchat"></i></a><a href="#">
                <i class="icon ion-social-twitter"></i></a><a href="#">
                <i class="icon ion-social-facebook"></i></a>
            </div>
            <ul class="list-inline">
                <li class="list-inline-item"><a href="#">Home</a></li>
                <li class="list-inline-item"><a href="#">Services</a></li>
                <li class="list-inline-item"><a href="#">About</a></li>
                <li class="list-inline-item"><a href="#">Terms</a></li>
                <li class="list-inline-item"><a href="#">Privacy Policy</a></li>
            </ul>
            <p class="copyright">frdrk00-e-commerce © 2023</p>
            </div> 
            </WhiteBox>
        </Center>
        </FooterWrapper>
    )
}