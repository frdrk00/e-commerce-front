import WhiteBox from "@/components/Box"
import Button from "@/components/Button"
import Center from "@/components/Center"
import Header from "@/components/Header"
import Input from "@/components/Input"
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
    `
    const CityHolder = styled.div`
    display: flex;
    gap: 5;
`
export default function AccountPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [country, setCountry] = useState('')
    const {data:session} = useSession()
    const [loaded, setLoaded] = useState(false)

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
        axios.get('/api/address').then(response => {
            setName(response.data.name)
            setEmail(response.data.email)
            setCity(response.data.city)
            setPostalCode(response.data.postalCode)
            setStreetAddress(response.data.streetAddress)
            setCountry(response.data.country)
            setLoaded(true)
        }) 
    }, [])
    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <h2>Wishlist</h2>
                            </WhiteBox>
                        </RevealWrapper>
                        
                    </div>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <h2>Account details</h2>
                                {!loaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {loaded && (
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
                                    <Button primary onClick={login}>Login</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    )
}