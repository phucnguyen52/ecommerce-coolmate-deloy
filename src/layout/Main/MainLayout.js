/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import { createContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import Cookies from 'js-cookie'
import Chat from '../../components/Chat/Chat'

export const StoreContext = createContext()
function MainLayout() {
    const navigate = useNavigate()
    const [count, setCount] = useState(0)
    const handleCount = (num) => {
        setCount(num)
    }
    const token = Cookies.get('token')
    const fetchCart = () => {
        const token = Cookies.get('token')

        if (!token) console.log(0)
        else
            try {
                fetch(`https://ecommerce-coolmate-server-production.up.railway.app/api/customer/cart`, {
                    credentials: 'include',
                })
                    .then((req) => req.json())
                    .then((res) => {
                        if (res.succes && res.cart?.length > 0) {
                            const total = res.cart.reduce((sum, item) => sum + item.quantity, 0)
                            setCount(total)
                        } else {
                            setCount(0)
                        }
                    })
            } catch {
                navigate('/error')
            }
    }
    useEffect(() => {
        fetchCart()
    }, [])
    const decreaseCount = (num) => {
        setCount((prevCount) => prevCount - num)
    }

    return (
        <StoreContext.Provider value={{ count, handleCount, fetchCart, decreaseCount }}>
            <div className="mx-auto w-full" style={{ maxWidth: '100vw' }}>
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />

                {token && <Chat></Chat>}
            </div>
        </StoreContext.Provider>
    )
}

export default MainLayout
