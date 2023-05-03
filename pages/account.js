import WhiteBox from "@/components/Box"
import Button from "@/components/Button"
import Center from "@/components/Center"
import Header from "@/components/Header"
import Input from "@/components/Input"
import ProductBox from "@/components/ProductBox"
import Spinner from "@/components/Spinner"
import axios from "axios"
import { signIn, signOut, useSession } from "next-auth/react"
import { RevealWrapper } from "next-reveal"
import { useEffect, useState } from "react"
import styled from "styled-components"

    const ColsWrapper = styled.div`
        display: grid;
        grid-template-columns: 1.2fr .8fr;
        gap: 40px;
        margin: 40px 0;
        p{
            margin: 5px;
        }
    `
    const CityHolder = styled.div`
        display: flex;
        gap: 5;
    `
    const WishedProductsGrid = styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    `

export default function AccountPage() {
    const {data:session} = useSession()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [country, setCountry] = useState('')
    const [addressLoaded, setAddressLoaded] = useState(true)
    const [wishlistLoaded, setWishlistLoaded] = useState(true)
    const [wishedProducts, setWishedProducts] = useState({})

    const logout = async () => {
        await signOut({
            callbackUrl: process.env.PUBLIC_URL,
        })
    }
    const login = async () => {
        await signIn('google'), {
            callbackUrl: process.env.PUBLIC_URL,
        }
    }
    const saveAddress = () => {
        const data = {name,email,city,streetAddress,postalCode,country}
        axios.put('/api/address', data)
    }
    useEffect(() => {
        if (!session) {
            return
        }
        setAddressLoaded(false)
        setWishlistLoaded(false)
        axios.get('/api/address').then(response => {
            setName(response.data.name)
            setEmail(response.data.email)
            setCity(response.data.city)
            setPostalCode(response.data.postalCode)
            setStreetAddress(response.data.streetAddress)
            setCountry(response.data.country)
            setAddressLoaded(true)
        }) 
        axios.get('/api/wishlist').then(response => {
            setWishedProducts(response.data.map(wp => wp.product))
            setWishlistLoaded(true)
        })
    }, [session])
    const productRemovedFromWishlist = (idToRemove) => {
        setWishedProducts(products => {
            return [...products.filter(p => p._id.toString() !== idToRemove)]
        })
    }

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <h2>Wishlist</h2>
                                <>{!session && ( <p>Login to add product to your wishlist</p>)}</>
                                {!wishlistLoaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {wishlistLoaded && (
                                    <>
                                    <WishedProductsGrid>
                                        {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                            <ProductBox 
                                                key={wp._id} 
                                                {...wp} 
                                                wished={true} 
                                                onRemoveFromWishlist={productRemovedFromWishlist} 
                                            />
                                        ))}
                                    </WishedProductsGrid>
                                        {wishedProducts.length === 0 && (
                                            <>{session && ( <p>Your wishlist is empty</p>)}</>
                                        )}
                                    </>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
{/* Acc box */}
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <h2>{session ? 'Account details' : 'Login'}</h2>
                                {!addressLoaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {addressLoaded && session && (
                                    <>
                                    <Input 
                                        type="text" 
                                        placeholder="Name" 
                                        name="name"
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder="Email" 
                                        name="email"
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)}  
                                    />
                                    <CityHolder>
                                        <Input 
                                            type="text" 
                                            placeholder="City" 
                                            name="city"
                                            value={city} 
                                            onChange={e => setCity(e.target.value)}  
                                        />
                                        <Input 
                                            type="text" 
                                            placeholder="Postal Code" 
                                            name="postalCode"
                                            value={postalCode} 
                                            onChange={e => setPostalCode(e.target.value)}  
                                        />
                                    </CityHolder>
                                    <Input 
                                        type="text" 
                                        placeholder="Street Address" 
                                        name="streetAddress"
                                        value={streetAddress} 
                                        onChange={e => setStreetAddress(e.target.value)}  
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder="Country" 
                                        name="country"
                                        value={country} 
                                        onChange={e => setCountry(e.target.value)}  
                                    />
                                    <Button black block onClick={saveAddress}>
                                        Save
                                    </Button>
                                    <hr/>
                                    </> 
                                )}
                                {session && (
                                    <Button primary onClick={logout}>Logout</Button>
                                )}
                                {!session && (
                                    <Button primary onClick={login}>Login with Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    )
}