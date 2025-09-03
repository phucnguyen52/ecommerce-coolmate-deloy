import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWard } from '../../services/app'
import ModalAllAddress from './ModalAllAddress'
const InforUser = () => {
    const [dataUpdate, setDataUpdate] = useState({})
    const [values, setValues] = useState({
        username: '',
        password: '',
        email: '',
        picture: '',
        id: '',
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setDataUpdate((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }
    const token = localStorage.getItem('token')
    const fetchInformation = async () => {
        try {
            const response = await axios.get(
                'https://ecommerce-coolmate-server-production.up.railway.app/api/customer',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            setImageUrl(response.data.user.picture)
            setValues((prevValues) => ({
                ...prevValues,
                id: response.data.user.id,
                username: response.data.user.fullName,
                password: response.data.user.password,
                email: response.data.user.email,
                picture: response.data.user.picture,
            }))
        } catch (error) {
            console.error('Lỗi khi fetch dữ liệu', error)
        }
    }
    useEffect(() => {
        fetchInformation()
    }, [])
    const [addresses, setAddresses] = useState([])
    const [defaultAddress, setDefaultAddress] = useState(null)
    const [showModalAddress, setShowModalAddress] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.succes) {
                setAddresses(response.data.address)
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu địa chỉ:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const defaultAddress = addresses.find((address) => address.isAddress === true)
        setDefaultAddress(defaultAddress)
    }, [addresses])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const req = {
            fullName: dataUpdate.name,
            picture: imageUrl,
        }
        try {
            const response = await axios.put(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/user/${values.id}`,
                req,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.success) {
                toast.success('Cập nhật thông tin thành công')
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật thông tin')
        }
    }
    const [isLoading, setIsLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState([])
    const handleBeforeUpload = async (event) => {
        const file = event.target.files[0]
        const formData = new FormData()
        formData.append('images', file)
        setIsLoading(true)
        try {
            const response = await fetch('https://ecommerce-coolmate-server-production.up.railway.app/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json()
            setImageUrl(data[0])
        } catch (error) {
            console.error('Tải ảnh không thành công', error)
        }
        setIsLoading(false)
    }

    return (
        <div>
            <div className="mx-auto w-11/12 md:w-4/6">
                <div>
                    <div className="py-6 text-2xl font-semibold md:py-12">Thông tin tài khoản</div>
                </div>
                <hr />
                <div>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full pt-3 md:w-3/4">
                            <div className="mt-6 flex flex-col md:mt-12 md:flex-row md:items-center">
                                <div className="mb-2 min-w-[150px] text-lg text-[#121f43] md:mb-0">Email</div>
                                <label htmlFor="email" className="flex-1">
                                    <input
                                        type="text"
                                        name="email"
                                        readOnly
                                        id="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="peer w-full resize-none rounded-lg border border-[#B1C9DC] px-3.5 py-3 font-medium leading-normal text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-slate-500 hover:border-[#121F43] focus:border-red-400 focus:ring-1 focus:ring-red-400 md:w-2/3"
                                    />
                                </label>
                            </div>

                            <div className="mt-8 flex flex-col md:flex-row md:items-center">
                                <div className="mb-2 min-w-[150px] text-lg text-[#121f43] md:mb-0">Họ và tên</div>
                                <label htmlFor="name" className="relative flex-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        defaultValue={values.username}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Họ và tên"
                                        className="peer w-full resize-none rounded-lg border border-[#B1C9DC] px-3.5 py-3 font-medium leading-normal text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-slate-500 hover:border-[#121F43] focus:border-[#2499ef] focus:ring-1 focus:ring-[#2499ef] md:w-2/3"
                                    />
                                </label>
                            </div>

                            <div className="mt-8 flex flex-col md:flex-row md:items-center">
                                <div className="mb-2 min-w-[150px] text-lg text-[#121f43] md:mb-0">Địa chỉ</div>
                                <div className="flex flex-row items-center gap-2">
                                    <div
                                        id="defaultAddress"
                                        className="peer resize-none rounded-lg border border-[#B1C9DC] px-3.5 py-3 font-medium leading-normal text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-slate-500 hover:border-[#121F43] focus:border-[#2499ef] focus:ring-1 focus:ring-[#2499ef] md:w-2/3"
                                    >
                                        {defaultAddress ? (
                                            <p>{defaultAddress.address}</p>
                                        ) : (
                                            <p className="text-base italic text-slate-500">
                                                Bạn chưa có địa chỉ nào...
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        className="mb-1 ml-0 cursor-pointer rounded px-3 py-2 text-sm font-semibold text-blue-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-100 hover:shadow-lg active:bg-slate-300 md:ml-2 md:mt-0"
                                        type="button"
                                        onClick={() => setShowModalAddress(true)}
                                    >
                                        Thay đổi
                                    </button>
                                </div>

                                {/* Modal */}
                            </div>
                        </div>
                        <hr className="mx-4 hidden h-auto w-px bg-gray-200 md:block" />
                        <div className="mt-10 w-full md:mt-14 md:w-1/2">
                            <div className="mb-5 flex items-center justify-center">
                                {isLoading ? (
                                    <div role="status" className="flex items-center justify-center">
                                        <svg
                                            aria-hidden="true"
                                            className="h-8 w-8 animate-spin fill-black text-gray-200 dark:text-gray-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBeforeUpload}
                                            style={{
                                                position: 'absolute',
                                                left: '-9999px',
                                            }}
                                            id="image-upload"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('image-upload').click()}
                                            disabled={isLoading}
                                            className="flex items-center justify-center rounded bg-gray-300 px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-400"
                                        >
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mr-2 inline w-6 fill-black"
                                                    viewBox="0 0 32 32"
                                                >
                                                    <path
                                                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                                        data-original="#000000"
                                                    />
                                                    <path
                                                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                                        data-original="#000000"
                                                    />
                                                </svg>
                                            </div>
                                            <div>Chọn ảnh</div>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {imageUrl ? (
                                <div>
                                    <div className="mt-4 flex justify-center">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt="Uploaded"
                                                className="h-[150px] w-[150px] rounded-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="mt-4 flex justify-center">
                                        {' '}
                                        <div className="h-[150px] w-[150px] border-2 border-dashed"></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex ">
                        <button
                            onClick={handleSubmit}
                            className="mx-auto my-10 min-w-[150px] cursor-pointer rounded-full bg-black px-4 py-3 text-center text-base text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
                {showModalAddress ? <ModalAllAddress setShowModalAddress={setShowModalAddress} /> : null}
            </div>
        </div>
    )
}

export default InforUser
