import styled from "styled-components"
import Button from "./Button"
import Link from "next/link"
import { useContext } from "react"
import { CartContext } from "./CartContext"

const ProductWrapper = styled.div`
    
`

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    border-radius: 10px;
    img{
        max-width: 100%;
        max-height: 80px;
    }
`
const Title = styled(Link)`
    font-weight: normal;
    font-size: .9rem;
    margin: 0;
    color: inherit;
    text-decoration: none;
`
const ProductInfoBox = styled.div`
    margin-top: 5px;
`
const PriceRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`
const Price = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`

export default function ProductBox({_id, title, description, price, images}) {
    const {addProduct} = useContext(CartContext)
    const url = `/product/${_id}`
    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <img src={images?.[0]} alt="" />
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <div>
                        <Price>${price}</Price>
                    </div>
                    <div>
                        <Button onClick={() => addProduct(_id)} primary outline>Add to cart</Button>
                    </div>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}