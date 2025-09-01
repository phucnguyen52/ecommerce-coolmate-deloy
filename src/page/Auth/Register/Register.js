import React, { useRef, useState } from 'react'
import Image from '../../../assets/images/register.jpg'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'
import { PiEyeSlash } from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
function Register() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [error, setError] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [token, setToken] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpError, setOtpError] = useState('')
    const navigate = useNavigate()
    const otpRefs = useRef([])
    const handleInputChange = (index, value) => {
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value) {
            if (index < otpRefs.current.length - 1) {
                otpRefs.current[index + 1].focus()
            }
        } else {
            if (index > 0) {
                otpRefs.current[index - 1].focus()
            }
        }
    }
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index]) {
            if (index > 0) {
                otpRefs.current[index - 1].focus()
            }
        }
    }
    const IsValidate = () => {
        let isproceedIdEmail = true
        let isproceedName = true
        let isproceedPhone = true
        let isproceedPass = true
        let isproceedCheckPass = true
        let isproceedError = true
        if (error === '') {
            isproceedError = true
        }
        //check id và mail
        if (email === null || email === '') {
            isproceedIdEmail = false
            toast.warning('Vui lòng nhập email của bạn')
            setEmailError('Vui lòng nhập email của bạn!')
        } else if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
            setEmailError('')
            isproceedIdEmail = true
        } else {
            isproceedIdEmail = false
            setEmailError(' Email không hợp lệ!')
            toast.warning('Email không hợp lệ!')
        }
        //check name
        if (name === null || name === '') {
            isproceedName = false
            setNameError('Vui lòng nhập tên của bạn')
            toast.warning('Vui lòng nhập tên của bạn')
        }
        //check số điện thoại
        // if (!phone.trim()) {
        //     isproceedPhone = false
        //     setPhoneError('Vui lòng nhập SĐT của bạn')
        //     toast.warning('Vui lòng nhập SĐT của bạn')
        // } else if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone)) {
        //     isproceedPhone = true
        //     setPhoneError('')
        // } else {
        //     isproceedPhone = false
        //     setPhoneError('SĐT không hợp lệ')
        //     toast.warning('SĐT không hợp lệ')
        // }
        // check mật khẩu
        if (!password.trim()) {
            isproceedPass = false
            setPasswordError('Vui lòng nhập mật khẩu của bạn!')
            toast.warning('Vui lòng nhập mật khẩu của bạn!')
        } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            setPasswordError('')
            isproceedPass = true
        } else {
            isproceedPass = false
            toast.warning(
                'Mật khẩu không hợp lệ! Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.',
            )
            setPasswordError(
                'Mật khẩu không hợp lệ! Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.',
            )
        }
        if (!confirmPassword.trim()) {
            isproceedCheckPass = false
            setConfirmPasswordError('Vui lòng nhập lại mật khẩu')
            toast.warning('Vui lòng nhập lại mật khẩu')
        } else if (password !== confirmPassword) {
            isproceedCheckPass = false
            setConfirmPasswordError('Mật khẩu không khớp')
            toast.warning('Mật khẩu không khớp')
        } else {
            setConfirmPasswordError('')
            isproceedCheckPass = true
        }

        return (
            isproceedIdEmail && isproceedName && isproceedPhone && isproceedPass && isproceedCheckPass && isproceedError
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setNameError('')
        setPasswordError('')
        setConfirmPasswordError('')
        setEmailError('')
        setOtpError('')
        e.preventDefault()
        if (IsValidate()) {
            const requestBody = {
                fullName: name,
                email: email,
                password: password,
            }

            try {
                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/signup',
                    requestBody,
                    { withCredentials: true },
                )
                const data = response.data
                if (response.status === 201) {
                    toast.success(data.message)
                    setToken(data.token)
                    setIsOtpSent(true)
                }
            } catch (error) {
                toast.error('Email đã tồn tại!')
                setError('Email đã tồn tại!')
            }
        }
    }
    const handleVerifyOTP = async () => {
        const codes = otp.join('')
        if (codes.length === 6) {
            try {
                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/active',
                    {
                        token: token,
                        code: codes,
                    },
                    { withCredentials: true },
                )
                const data = response.data
                if (data.success === true) {
                    toast.success('Đăng kí thành công.')
                    setIsOtpSent(false)
                    setName('')
                    setEmail('')
                    setPassword('')
                    setConfirmPassword('')
                    navigate('/auth/login')
                }
            } catch (error) {
                toast.error('Mã OTP sai')
                setOtpError('Mã xác thực sai. Vui lòng nhập lại mã xác thực!')
            }
        } else {
            toast.warning('Vui lòng nhập đầy đủ mã xác thực!')
            setOtpError('Vui lòng nhập đầy đủ mã xác thực!')
        }
    }
    return (
        <div className="mx-auto  flex h-screen w-full max-w-5xl items-center justify-center md:flex-row">
            <div className="w-full p-4 md:w-3/6">
                <div className="mb-4 text-3xl font-medium md:text-5xl">Đăng ký</div>
                <div className="mb-4 text-sm">
                    Đăng nhập để không bỏ lỡ quyền lợi tích luỹ và hoàn tiền <br />
                    cho bất kỳ đơn hàng nào.
                </div>
                <div className="mb-4 text-sm font-bold">Đăng nhập hoặc đăng ký (miễn phí)</div>
                <div className="flex">
                    <a href="#!" className="mr-2 rounded border border-solid border-gray-400 p-2">
                        <FcGoogle className="h-8 w-8" />
                    </a>
                </div>
                <div className="relative">
                    <div className="ml-5 p-4 text-sm before:absolute before:left-0 before:top-7 before:block before:h-px before:w-[6%] before:flex-1 before:bg-gray-400 before:content-[''] after:absolute after:right-0 after:top-7 after:block after:h-px after:w-[78%] after:flex-1 after:bg-gray-400 after:content-[''] lg:after:w-10/12">
                        Hoặc
                    </div>
                </div>
                <div className="flex flex-col">
                    <div>
                        <input
                            type="text"
                            placeholder="Tên của bạn"
                            name="name"
                            className={`${!nameError ? 'focus:border focus:border-solid focus:border-blue-800 focus:outline-none' : 'border border-solid border-red-500 outline-none'} mt-2 w-full rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {nameError && <div className="ml-4 pt-1 text-sm text-rose-500">{nameError}</div>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Email của bạn"
                            name="email"
                            className={`${!emailError ? 'focus:border focus:border-solid focus:border-blue-800 focus:outline-none' : 'border border-solid border-red-500 outline-none'} mt-4 w-full rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <div className="ml-4 pt-1 text-sm text-rose-500">{emailError}</div>}
                        {error && <div className="ml-4 pt-1 text-sm text-rose-500">{error}</div>}
                    </div>
                    <div className="relative">
                        <input
                            type={isShowPassword === true ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            name="password"
                            className={`${!passwordError ? 'focus:border focus:border-solid focus:border-blue-800 focus:outline-none' : 'border border-solid border-red-500 outline-none'} mt-4 w-full rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <div className="ml-4 pt-1 text-sm text-rose-500">{passwordError}</div>}
                        <PiEyeSlash
                            className="absolute right-4 top-7 h-6 w-6 cursor-pointer text-gray-400"
                            onClick={() => setIsShowPassword(!isShowPassword)}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={isShowConfirmPassword === true ? 'text' : 'password'}
                            placeholder="Nhập lại mật khẩu"
                            name="confirmPassword"
                            className={`${!confirmPasswordError ? 'focus:border focus:border-solid focus:border-blue-800 focus:outline-none' : 'border border-solid border-red-500 outline-none'} mt-4 w-full rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordError && (
                            <div className="ml-4 pt-1 text-sm text-rose-500">{confirmPasswordError}</div>
                        )}
                        <PiEyeSlash
                            className="absolute right-4 top-7 h-6 w-6 cursor-pointer text-gray-400"
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                        />
                    </div>

                    <button
                        className="mt-4 rounded-full bg-black px-4 py-3 text-sm text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                        onClick={handleSubmit}
                    >
                        {/* {loadingAPI && <AiOutlineLoading3Quarters className="inline text-black" />} &nbsp; */}
                        Đăng ký
                    </button>
                    {/* {errors && <div className="ml-4 pt-1 text-sm text-rose-500">{errors}</div>} */}
                </div>
                <Link
                    to={'/auth/login'}
                    className="mt-2 cursor-pointer text-sm font-medium text-blue-700 hover:text-black"
                >
                    Đăng nhập
                </Link>
                {isOtpSent && (
                    <>
                        <div className={`fixed inset-0 z-10 overflow-y-auto ${isOtpSent ? 'block' : 'hidden'}`}>
                            <div className="flex min-h-screen items-center justify-center p-4">
                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>

                                <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8">
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg rounded-tr-xl bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                                        onClick={() => setIsOtpSent(false)}
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M10.586 10l5.707-5.707a1 1 0 10-1.414-1.414L9.172 8.586 3.465 2.879a1 1 0 00-1.414 1.414L7.758 10 2.051 15.707a1 1 0 101.414 1.414L9.172 11.414l5.707 5.707a1 1 0 001.414-1.414L10.586 10z"
                                            />
                                        </svg>
                                    </button>
                                    <h2 className="mb-4 text-center text-2xl font-semibold sm:text-3xl">
                                        Xác thực email
                                    </h2>
                                    <p className="mb-4 text-center text-sm text-gray-600 sm:text-base">
                                        Chúng tôi đã gửi mã đến email <strong>{email}</strong>. <br />
                                        Vui lòng kiểm tra email của bạn!
                                    </p>

                                    <div className="text-center">
                                        <div className="mb-4 flex justify-center space-x-2 sm:space-x-4">
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    className="h-10 w-10 rounded-xl border border-gray-300 text-center focus:border-blue-700 focus:ring-blue-700 sm:h-12 sm:w-12"
                                                    type="text"
                                                    maxLength="1"
                                                    value={otp[index]}
                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex flex-col items-center justify-between gap-4">
                                            {otpError && <div className="mt-1 text-sm text-rose-500">{otpError}</div>}
                                            <button
                                                className="rounded-xl bg-blue-700 px-4 py-2 text-white hover:bg-blue-600"
                                                onClick={handleVerifyOTP}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleVerifyOTP()
                                                    }
                                                }}
                                            >
                                                Xác thực
                                            </button>

                                            <div className="text-sm">
                                                <p className="mb-1">Bạn chưa nhận được mã?</p>
                                                <button
                                                    className="text-blue-700 hover:underline"
                                                    onClick={handleSubmit}
                                                >
                                                    Gửi lại mã
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <img src={Image} alt="" className="hidden h-auto w-full p-4 sm:block md:w-3/6" />
        </div>
    )
}

export default Register
