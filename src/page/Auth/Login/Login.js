import React, { useEffect, useState } from 'react'
import Image from '../../../assets/images/login.jpg'
import { FcGoogle } from 'react-icons/fc'
import { PiEyeSlash } from 'react-icons/pi'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import LOGO from '../../../assets/img/LOGO.png'

const getOauthGoogleUrl = () => {
    const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOOGLE_AUTHORIZED_REDIRECT_URI } = process.env
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: REACT_APP_GOOGLE_AUTHORIZED_REDIRECT_URI,
        client_id: REACT_APP_GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    }
    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
}

function Login() {
    const navigate = useNavigate()
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')
    const [searchParams] = useSearchParams()
    const oauthGoogleUrl = getOauthGoogleUrl()
    useEffect(() => {
        const token = searchParams.get('token')
        localStorage.setItem('token', token)
        navigate('/')
    }, [searchParams, navigate])
    const handleSubmit = async (e) => {
        setEmailError('')
        setPasswordError('')
        setErrors('')
        e.preventDefault()
        if (validate()) {
            try {
                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/login',
                    {
                        email: email,
                        password: password,
                    },
                )
                // && response.data.roleID === 2
                if (response && response.data && response.data.role === 'customer') {
                    // Cookies.set('token', response.data.token)
                    localStorage.setItem('token', response.data.token)
                    toast.success('Đăng nhập thành công', {
                        autoClose: 500,
                    })
                    navigate('/home')
                } else {
                    console.error('Đăng nhập không thành công')
                    toast.error('Bạn không phải là người dùng')
                }
            } catch (error) {
                setErrors(error.response.data.message)
                toast.error(error.response.data.message)
            }
        }
    }

    const validate = () => {
        let resultEmail = true
        let resultPassword = true
        if (email === null || email === '') {
            resultEmail = false
            toast.warning('Vui lòng nhập email của bạn')
            setEmailError('Vui lòng nhập email của bạn!')
        } else if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
            setEmailError('')
            resultEmail = true
        } else {
            resultEmail = false
            setEmailError(' Email không hợp lệ!')
            toast.warning('Email không hợp lệ!')
        }
        if (!password.trim()) {
            resultPassword = false
            setPasswordError('Vui lòng nhập mật khẩu của bạn!')
            toast.warning('Vui lòng nhập mật khẩu của bạn!')
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            resultPassword = false
            toast.warning(
                'Mật khẩu không hợp lệ! Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.',
            )
            setPasswordError(
                'Mật khẩu không hợp lệ! Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.',
            )
        } else {
            setPasswordError('')
            resultPassword = true
        }
        return resultEmail && resultPassword
    }
    return (
        <div className="relative  mx-auto flex h-screen w-full max-w-5xl items-center justify-center md:flex-row">
            <div className="absolute left-1/2 top-0 flex w-full -translate-x-1/2 items-center justify-center bg-slate-100 sm:hidden">
                <div className="">
                    <img src={LOGO} alt="Coolmate" className="h-14 w-14 lg:h-20 lg:w-20" />
                </div>
            </div>
            <div className="w-full p-4 md:w-3/6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-3xl font-medium md:text-5xl">Đăng nhập</div>
                    <div className="mb-4 text-sm">
                        Đăng nhập để không bỏ lỡ quyền lợi tích luỹ và hoàn tiền <br />
                        cho bất kỳ đơn hàng nào.
                    </div>
                    <div className="mb-4 text-sm font-bold">Đăng nhập hoặc đăng ký (miễn phí)</div>
                    <div className="flex">
                        <Link to={oauthGoogleUrl} className="mr-2 rounded border border-solid border-gray-400 p-2">
                            <FcGoogle className="h-8 w-8" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="ml-5 p-4 text-sm before:absolute before:left-0 before:top-7 before:block before:h-px before:w-[6%] before:flex-1 before:bg-gray-400 before:content-[''] after:absolute after:right-0 after:top-7 after:block after:h-px after:w-[78%] after:flex-1 after:bg-gray-400 after:content-[''] lg:after:w-10/12">
                            Hoặc
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Email của bạn"
                            name="email"
                            className={`${!emailError ? 'focus:border focus:border-solid focus:border-blue-800 focus:outline-none' : 'border border-solid border-red-500 outline-none'} rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        {emailError && <div className="ml-4 pt-1 text-sm text-rose-500">{emailError}</div>}
                        <div className="relative">
                            <input
                                type={isShowPassword === true ? 'text' : 'password'}
                                placeholder="Mật khẩu"
                                name="password"
                                className={`${!passwordError ? 'focus:border focus:border-solid focus:border-blue-800 focus:outline-none' : 'border border-solid border-red-500 outline-none'} mt-4 w-full rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            {passwordError && <div className="ml-4 pt-1 text-sm text-rose-500">{passwordError}</div>}
                            <PiEyeSlash
                                className="absolute right-4 top-7 h-6 w-6 cursor-pointer text-gray-400"
                                onClick={() => setIsShowPassword(!isShowPassword)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 rounded-full bg-black px-4 py-3 text-sm text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                        >
                            Đăng nhập
                        </button>
                        {errors && <div className="ml-4 pt-1 text-sm text-rose-500">{errors}</div>}
                    </div>
                    <div className="flex justify-between pt-2">
                        <Link
                            to="/auth/register"
                            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-black"
                        >
                            Đăng ký tài khoản mới
                        </Link>
                        {/* <div className="cursor-pointer text-sm font-medium text-blue-700 hover:text-black">
                            Quên mật khẩu
                        </div> */}
                    </div>
                </form>
            </div>
            <img src={Image} alt="" className="hidden h-auto w-full p-4 sm:block md:w-3/6" />
        </div>
    )
}

export default Login
