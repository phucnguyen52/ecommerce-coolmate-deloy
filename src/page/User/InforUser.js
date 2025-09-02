import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FaWindowClose } from 'react-icons/fa'
import Select from './Select'
import InputReadOnly from './InputReadOnly'
import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWard } from '../../services/app'
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

    const fetchInformation = async () => {
        try {
            const response = await axios.get(
                'https://ecommerce-coolmate-server-production.up.railway.app/api/customer',
                {
                    withCredentials: true,
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
    const [showAddAddressModal, setShowAddAddressModal] = useState(false)
    const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false)
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')
    const [numberAddress, setNumberAddress] = useState('')
    const [reset, setReset] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [loading, setLoading] = useState(false)
    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address',
                {
                    withCredentials: true,
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
    const validate = () => {
        let resultPhone = true
        if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone.trim())) {
            setPhoneError('')
            resultPhone = true
        } else {
            setPhoneError('Số điện thoại không hợp lệ')
            toast.warning('Số điện thoại không hợp lệ')
            resultPhone = false
        }
        return resultPhone
    }
    const handleSetDefaultAddress = async (addressId) => {
        try {
            const response = await axios.put(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address/${addressId}`,
                { isAddress: true },
                {
                    withCredentials: true,
                },
            )
            if (response.data.succes) {
                fetchData()
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', error)
        }
    }
    const handleDeleteAddress = async (addressId) => {
        try {
            const updatedAddresses = addresses.filter((address) => address.id !== addressId)
            const response = await axios.delete(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address/${addressId}`,
                {
                    withCredentials: true,
                },
            )
            if (response.data.succes) {
                setAddresses(updatedAddresses)
                toast.success('Xóa địa chỉ thành công', { autoClose: 1000 })
            }
        } catch (error) {
            console.error('Xóa địa chỉ không thành công', error)
        }
    }
    useEffect(() => {
        const fetchPublicProvince = async () => {
            const response = await apiGetPublicProvinces()
            if (response.status === 200) {
                setProvinces(response?.data)
            }
        }
        fetchPublicProvince()
    }, [])
    useEffect(() => {
        setDistrict(null)
        const fetchPublicDistrict = async () => {
            const response = await apiGetPublicDistrict(province)
            if (response.status === 200) {
                setDistricts(response.data?.districts)
            }
        }
        province && fetchPublicDistrict()
        !province ? setReset(true) : setReset(false)
        !province && setDistricts([])
    }, [province])
    useEffect(() => {
        setWard(null)
        const fetchPublicWard = async () => {
            const response = await apiGetPublicWard(district)
            if (response.status === 200) {
                setWards(response.data?.wards)
            }
        }
        district && fetchPublicWard()
        !district ? setReset(true) : setReset(false)
        !district && setWards([])
    }, [district])
    const handleAddAddress = () => {
        setShowAddAddressModal(true)
        setShowModalAddress(false)
    }
    const handleCloseModalAddAddress = () => {
        setShowAddAddressModal(false)
        setShowModalAddress(true)
        resetModal()
    }

    useEffect(() => {
        setIsFormValid(province !== '' && district !== '' && ward !== '' && numberAddress !== '' && phone !== '')
    }, [province, district, ward, numberAddress, phone])
    const formatAddress = () => {
        return `${numberAddress ? `${numberAddress}, ` : ''}${ward ? `${wards?.find((item) => item.code == ward)?.name}, ` : ''}${district ? `${districts?.find((item) => item.code == district)?.name}, ` : ''}${province ? provinces?.find((item) => item.code == province)?.name : ''}`
    }
    const handleAddNewAddress = async () => {
        if (!isFormValid) {
            toast.warning('Vui lòng chọn đầy đủ thông tin địa chỉ muốn thêm')
            return
        }
        setPhoneError('')
        if (validate()) {
            try {
                const formattedAddress = formatAddress()

                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address',
                    { address: formattedAddress, numberPhone: phone },
                    {
                        withCredentials: true,
                    },
                )
                if (response.data.succes) {
                    setShowModalAddress(true)
                    setShowAddAddressModal(false)
                    toast.success('Thêm địa chỉ thành công')
                    fetchData()
                    resetModal()
                }
            } catch (error) {
                toast.error('Thêm địa chỉ không thành công', error)
            }
        }
    }

    const resetModal = () => {
        setPhone('')
        setProvince('')
        setDistrict('')
        setWard('')
        setNumberAddress('')
    }
    const handleCloseModalUpdateAddress = () => {
        setShowUpdateAddressModal(false)
        setShowModalAddress(true)
        resetModal()
    }
    const [idd, setIdd] = useState()
    const handleUpdateAddress = async (addressId) => {
        setLoading(true)
        const addressToUpdate = addresses.find((address) => address.id === addressId)

        setIdd(addressToUpdate.id)
        setPhone(addressToUpdate.numberPhone)
        const updateAddress = addressToUpdate.address
        setShowUpdateAddressModal(true)
        setShowModalAddress(false)
        const parts = updateAddress.split(', ')
        const number = parts[0] || ''
        const wardName = parts[1] || ''
        const districtName = parts[2] || ''
        const provinceName = parts[3] || ''
        setNumberAddress(number)
        let provinceList = provinces
        if (!provinceList || provinceList.length === 0) {
            const res = await apiGetPublicProvinces()
            if (res.status === 200) {
                provinceList = res.data
                setProvinces(provinceList)
            } else {
                console.error('Failed to fetch provinces')
                return
            }
        }
        const foundProvince = provinceList.find((p) => p.name === provinceName)
        if (!foundProvince) return
        setProvince(foundProvince.code)

        const districtRes = await apiGetPublicDistrict(foundProvince.code)
        if (districtRes.status !== 200) return
        const districtList = districtRes.data.districts || []

        const foundDistrict = districtList.find((d) => d.name === districtName)
        if (!foundDistrict) return
        setDistrict(foundDistrict.code)

        const wardRes = await apiGetPublicWard(foundDistrict.code)
        if (wardRes.status !== 200) return
        const wardList = wardRes.data.wards || []

        const foundWard = wardList.find((w) => w.name === wardName)
        if (!foundWard) return
        setWard(foundWard.code)
        setNumberAddress(number)
        setLoading(false)
    }

    const updateAddressUser = async (addressId) => {
        const phoneAddress = phone.trim()
        const updatedNumberAddress = numberAddress
        const updatedWard = ward
        const updatedDistrict = district
        const updatedProvince = province
        const selectedProvinceName = provinces.find((item) => item.province_id === updatedProvince)?.province_name

        const selectedDistrictName = districts.find((item) => item.district_id === updatedDistrict)?.district_name

        const selectedWardName = wards.find((item) => item.ward_id === updatedWard)?.ward_name
        if (!isFormValid) {
            toast.warning('Vui lòng chọn đầy đủ thông tin địa chỉ để cập nhật')
            return
        }
        const readOnlyValue =
            updatedNumberAddress + ', ' + selectedWardName + ', ' + selectedDistrictName + ', ' + selectedProvinceName
        if (validate()) {
            try {
                const response = await axios.put(
                    `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address/${idd}`,
                    {
                        address: readOnlyValue,
                        numberPhone: phoneAddress,
                    },
                    { withCredentials: true },
                )
                if (response.data.succes) {
                    fetchData()
                    setIdd(null)
                    resetModal()
                    fetchData()
                    toast.success('Cập nhật địa chỉ thành công')
                    setShowUpdateAddressModal(false)
                    setShowModalAddress(true)
                }
            } catch (error) {
                toast.error('Cập nhật địa chỉ không thành công')
            }
        }
    }
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
                    withCredentials: true,
                },
            )
            if (response.data.success) {
                toast.success('Cập nhật thông tin thành công')
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật thông tin')
        }
    }
    const cleanAddress = (address) => {
        let parts = address.split(', ')
        let cleanedParts = parts.filter((part) => part.toLowerCase() !== 'undefined')
        let cleanedAddress = cleanedParts.join(', ')
        return cleanedAddress
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
                credentials: 'include',
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

                {showModalAddress ? (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-2">
                            <div className="relative mx-auto my-6 w-full lg:w-3/5">
                                {/*content*/}
                                <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                    {/*header*/}
                                    <button
                                        className="absolute right-4 top-4 text-red-500 hover:text-red-600"
                                        type="button"
                                        onClick={() => setShowModalAddress(false)}
                                    >
                                        <FaWindowClose className="h-8 w-8" />
                                    </button>
                                    <div className="flex items-start justify-between rounded-t border-b p-5">
                                        <h3 className="pr-10 text-xl font-semibold md:text-3xl">
                                            Địa chỉ của người dùng
                                        </h3>
                                    </div>
                                    {/*body*/}
                                    <div className="relative flex-auto p-6">
                                        <div>
                                            {addresses.map((data, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-4 flex flex-col justify-between gap-2 rounded-lg border p-3 lg:flex-row lg:items-center"
                                                >
                                                    <div className="flex flex-col">
                                                        {`${data.numberPhone} - `}
                                                        {cleanAddress(data.address)}
                                                        {data.isAddress && (
                                                            <span className="w-fit border border-red-500 px-2 py-1 text-xs text-red-500">
                                                                Mặc định
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap justify-end gap-2 md:ml-4">
                                                        <button
                                                            className=" mr-2 rounded-lg bg-blue-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            onClick={() => handleUpdateAddress(data.id)}
                                                        >
                                                            Cập nhật
                                                        </button>

                                                        {!data.isAddress && (
                                                            <button
                                                                className="mr-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                                                                onClick={() => handleDeleteAddress(data.id)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        )}
                                                        {/* Nút "Mặc định" */}
                                                        <button
                                                            className={`rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 ${data.isAddress ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'}`}
                                                            onClick={() => handleSetDefaultAddress(data.id)}
                                                            disabled={data.isAddress} // Ngăn người dùng thay đổi địa chỉ mặc định
                                                        >
                                                            Mặc định
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Nút "Thêm địa chỉ mới" */}
                                            <button
                                                className=" mt-2 rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-base font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                                                onClick={handleAddAddress}
                                            >
                                                Thêm địa chỉ mới
                                            </button>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className=" flex items-center justify-end rounded-b border-t border-solid p-6">
                                        <button
                                            className="cursor-pointer rounded-md bg-black px-8 py-3 text-center text-base text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                                            type="button"
                                            onClick={() => setShowModalAddress(false)}
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                    </>
                ) : null}
                {showUpdateAddressModal ? (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-2">
                            <div className="relative mx-auto my-6 w-full max-w-3xl">
                                {/*content*/}
                                <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                    {/*header*/}
                                    <button
                                        className="background-transparent absolute right-[22px] top-[18px] text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                                        type="button"
                                        onClick={() => handleCloseModalUpdateAddress()}
                                    >
                                        <FaWindowClose className="h-8 w-8" />
                                    </button>
                                    <div className="flex items-start justify-between rounded-t border-b p-5">
                                        <h3 className="pr-10 text-xl font-semibold md:text-3xl">Cập nhật địa chỉ</h3>
                                    </div>
                                    {/*body*/}
                                    {!loading ? (
                                        <>
                                            <div>
                                                <div className="relative max-h-[80vh] overflow-y-auto px-4 py-6 md:px-16">
                                                    <div className="mb-4">
                                                        <label className="font-medium" htmlFor="phone">
                                                            Số điện thoại
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="phone"
                                                            id="phone"
                                                            value={phone}
                                                            placeholder="Số điện thoại"
                                                            className="mt-2 w-full rounded-md border border-gray-300 p-2 outline-none"
                                                            onChange={(e) => setPhone(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-col gap-4 md:flex-row">
                                                                <Select
                                                                    type="province"
                                                                    value={province}
                                                                    setValue={setProvince}
                                                                    options={provinces}
                                                                    label="Tỉnh/Thành phố"
                                                                />
                                                                <Select
                                                                    reset={reset}
                                                                    type="district"
                                                                    value={district}
                                                                    setValue={setDistrict}
                                                                    options={districts}
                                                                    label="Quận/Huyện"
                                                                />
                                                                <Select
                                                                    reset={reset}
                                                                    type="ward"
                                                                    value={ward}
                                                                    setValue={setWard}
                                                                    options={wards}
                                                                    label="Phường/Xã"
                                                                />
                                                            </div>
                                                            <label className="font-medium" htmlFor="address">
                                                                Số nhà/Thôn/Xóm
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                id="address"
                                                                value={numberAddress}
                                                                placeholder="Số nhà/Thôn/Xóm"
                                                                className="w-full rounded-md border border-gray-300 p-2 outline-none"
                                                                onChange={(e) => setNumberAddress(e.target.value)}
                                                            />
                                                            <InputReadOnly
                                                                label="Địa chỉ cụ thể"
                                                                value={`${numberAddress ? `${numberAddress}, ` : ''}${ward ? `${wards?.find((item) => item.code == ward)?.name},` : ''} ${district ? `${districts?.find((item) => item.code == district)?.name},` : ''} ${province ? provinces?.find((item) => item.code == province)?.name : ''}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-center p-5">
                                                <div
                                                    class="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                                    role="status"
                                                >
                                                    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                                        Loading...
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/*footer*/}
                                    <div className=" flex items-center justify-end rounded-b border-t border-solid p-6">
                                        <button
                                            className="cursor-pointer rounded-md bg-black px-8 py-3 text-center text-base text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                                            type="button"
                                            onClick={() => updateAddressUser()}
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                    </>
                ) : null}
                {showAddAddressModal ? (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-2">
                            <div className="relative mx-auto my-6 w-full max-w-3xl">
                                {/*content*/}
                                <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                    {/*header*/}
                                    <button
                                        className="background-transparent absolute right-[22px] top-[18px] text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                                        type="button"
                                        onClick={() => handleCloseModalAddAddress()}
                                    >
                                        <FaWindowClose className="h-8 w-8" />
                                    </button>
                                    <div className="flex items-start justify-between rounded-t border-b p-5">
                                        <h3 className="pr-10 text-xl font-semibold md:text-3xl">
                                            Thêm địa chỉ người dùng
                                        </h3>
                                    </div>
                                    {/*body*/}
                                    <div>
                                        <div className="relative max-h-[80vh] overflow-y-auto px-4 py-6 md:px-16">
                                            <div className="mb-4">
                                                <label className="font-medium" htmlFor="phone">
                                                    Số điện thoại
                                                </label>
                                                <input
                                                    type="number"
                                                    name="phone"
                                                    id="phone"
                                                    value={phone}
                                                    placeholder="Số điện thoại"
                                                    className="mt-2 w-full rounded-md border border-gray-300 p-2 outline-none"
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                            <div className="w-full">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-4 md:flex-row">
                                                        <Select
                                                            type="province"
                                                            value={province}
                                                            setValue={setProvince}
                                                            options={provinces}
                                                            label="Tỉnh/Thành phố"
                                                        />
                                                        <Select
                                                            reset={reset}
                                                            type="district"
                                                            value={district}
                                                            setValue={setDistrict}
                                                            options={districts}
                                                            label="Quận/Huyện"
                                                        />
                                                        <Select
                                                            reset={reset}
                                                            type="ward"
                                                            value={ward}
                                                            setValue={setWard}
                                                            options={wards}
                                                            label="Phường/Xã"
                                                        />
                                                    </div>
                                                    <label className="font-medium" htmlFor="address">
                                                        Số nhà/Thôn/Xóm
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        id="address"
                                                        value={numberAddress}
                                                        placeholder="Số nhà/Thôn/Xóm"
                                                        className="w-full rounded-md border border-gray-300 p-2 outline-none"
                                                        onChange={(e) => setNumberAddress(e.target.value)}
                                                    />
                                                    <InputReadOnly
                                                        label="Địa chỉ cụ thể"
                                                        value={`${numberAddress ? `${numberAddress}, ` : ''}${ward ? `${wards?.find((item) => item.code == ward)?.name},` : ''} ${district ? `${districts?.find((item) => item.code == district)?.name},` : ''} ${province ? provinces?.find((item) => item.code == province)?.name : ''}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className=" flex items-center justify-end rounded-b border-t border-solid p-6">
                                        <button
                                            className="cursor-pointer rounded-md bg-black px-8 py-3 text-center text-base text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                                            type="button"
                                            onClick={handleAddNewAddress}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default InforUser
