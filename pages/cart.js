import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin: 40px 0;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr;
    }
    table thead tr th:nth-child(3),
    table tbody tr td:nth-child(3),
    table tbody tr.subTotal td:nth-child(2){
        text-align: right;
    }
    table tr.subTotal td{
        padding: 15px 0;
    }
    table tbody tr.subTotal td:nth-child(2){
        font-size: 1.4rem;
    }
    tr.total td{
        font-weight: bold;
    }
`
const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`
const ProductInfoCell = styled.td`
    padding: 10px 0;

`
const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        width: 100px;
        height: 100px; 
        img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`
const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`
const CityHolder = styled.div`
    display: flex;
    gap: 5;
`

export default function CartPage() {
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext)
    const {data:session} = useSession()
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [country, setCountry] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [shippingFee, setShippingFee] = useState(null)

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart/', {ids:cartProducts})
            .then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([])
        }
    }, [cartProducts])

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }
        if (window.location.href.includes('success')) {
            setIsSuccess(true)
            clearCart()
        }
        axios.get('/api/settings?name=shippingFee').then(response => {
            setShippingFee(response.data.value)
        })
    }, [])

    useEffect(() => {
        if (!session) {
            return
        }
        axios.get('/api/address').then(response => {
        setName(response.data.name);
        setEmail(response.data.email);
        setCity(response.data.city);
        setPostalCode(response.data.postalCode);
        setStreetAddress(response.data.streetAddress);
        setCountry(response.data.country);
        });
    }, [session]);

    const moreOfThisProduct = (id) => {
        addProduct(id)
    }

    const lessOfThisProduct = (id) => {
        removeProduct(id)
    }

    const goToPayment = async () => {
        const response = await axios.post('/api/checkout', {
            name, email, city, postalCode, streetAddress, country,
            cartProducts,
        })

        if (response.data.url) {
            window.location = response.data.url
            console.log(response.data.url);
        }
    }

    let productsTotal = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        productsTotal += price
    }

    
    if (isSuccess) {
        return (
            <>
                <Header/>
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </Box>                    
                    </ColumnsWrapper>
                </Center>
            </>
        )
    }

    console.log(shippingFee);
    return (
        <>
            <Header />
            <Center>
            <ColumnsWrapper>
                <RevealWrapper delay={0}>
                    <Box>
                        <h2>Cart</h2>
                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}
                        {products?.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <ProductInfoCell>
                                            <ProductImageBox>
                                                <img src={product.images[0]} alt="" />                                          
                                            </ProductImageBox>
                                                {product.title}  
                                        </ProductInfoCell>
                                        <td>
                                            <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                            <QuantityLabel>
                                                {cartProducts.filter(id => id === product._id).length}
                                            </QuantityLabel>
                                            <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                        </td>
                                        <td>$
                                        {cartProducts.filter(id => id === product._id).length * product.price}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="subTotal">
                                    <td colSpan={2}>Products</td>
                                    <td>${productsTotal}</td>
                                </tr>
                                <tr className="subTotal">
                                    <td colSpan={2}>Shipping</td>
                                    <td>${shippingFee}</td>
                                </tr>
                                <tr className="subTotal total">
                                    <td colSpan={2}>Total</td>
                                    <td>${productsTotal + parseInt(shippingFee || 0)}</td>
                                </tr>
                            </tbody>
                        </Table>
                        )}
                    </Box>
                </RevealWrapper>
                    {!!cartProducts?.length && (
                        <RevealWrapper delay={100}>
                            <Box>
                                <h2>Order information</h2>
                                <Input 
                                    type="text" 
                                    placeholder="Name" 
                                    name={name}
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                />
                                <Input 
                                    type="text" 
                                    placeholder="Email" 
                                    name={email}
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}  
                                />
                                <CityHolder>
                                    <Input 
                                        type="text" 
                                        placeholder="City" 
                                        name={city}
                                        value={city} 
                                        onChange={e => setCity(e.target.value)}  
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder="Postal Code" 
                                        name={postalCode}
                                        value={postalCode} 
                                        onChange={e => setPostalCode(e.target.value)}  
                                    />
                                </CityHolder>
                                <Input 
                                    type="text" 
                                    placeholder="Street Address" 
                                    name={streetAddress}
                                    value={streetAddress} 
                                    onChange={e => setStreetAddress(e.target.value)}  
                                />
                                <Input 
                                    type="text" 
                                    placeholder="Country" 
                                    name={country}
                                    value={country} 
                                    onChange={e => setCountry(e.target.value)}  
                                />
                                <Button black block onClick={goToPayment}>
                                        Continue to payment
                                </Button>
                            </Box>
                        </RevealWrapper>
                    )}
                </ColumnsWrapper>
            </Center>
            <Footer />
        </>
    )
}