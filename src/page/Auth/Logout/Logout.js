import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        localStorage.clear()
        Cookies.remove('token')
        navigate('/home')
        window.location.reload()
    }, [navigate])

    return null
}

export default Logout
