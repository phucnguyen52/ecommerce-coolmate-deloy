import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FaWindowClose } from 'react-icons/fa'
import { apiGetPublicDistrict, apiGetPublicProvinces, apiGetPublicWard } from '../../services/app'
import Select from '../../page/User/Select'
import InputReadOnly from '../../page/User/InputReadOnly'

const SpecificAddress = ({
    fetchData,
    setShowAddAddressModal,
    setShowUpdateAddressModal,
    addressId,
    numberPhone,
    provinceName,
    districtName,
    wardName,
    numberAddressName,
    mode,
    fetchDataAddress,
}) => {
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState(provinceName ?? '')
    const [district, setDistrict] = useState(districtName ?? '')
    const [ward, setWard] = useState(wardName ?? '')
    const [numberAddress, setNumberAddress] = useState(numberAddressName ?? '')
    const [reset, setReset] = useState(false)
    const [phone, setPhone] = useState(numberPhone ?? '')
    const [id, setId] = useState(addressId ?? '')
    const [isFormValid, setIsFormValid] = useState(false)
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
        setDistrict('')
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
        setWard('')
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
    useEffect(() => {
        if (provinceName) setProvince(provinceName)
        if (districtName) setDistrict(districtName)
        if (wardName) setWard(wardName)
        if (numberAddressName) setNumberAddress(numberAddressName)
        if (numberPhone) setPhone(numberPhone)
    }, [provinceName, districtName, wardName, numberAddressName, numberPhone])
    useEffect(() => {
        const address = `${numberAddress ? `${numberAddress},` : ''}${
            ward ? `${wards?.find((item) => item.ward_id === ward)?.ward_name},` : ''
        } ${district ? `${districts?.find((item) => item.district_id === district)?.district_name}` : ''}`
    }, [province, district, ward, numberAddress])
    const formatAddress = () => {
        return `${numberAddress ? `${numberAddress}, ` : ''}${ward ? `${wards?.find((item) => item.code == ward)?.name}, ` : ''}${district ? `${districts?.find((item) => item.code == district)?.name}, ` : ''}${province ? provinces?.find((item) => item.code == province)?.name : ''}`
    }
    useEffect(() => {
        setIsFormValid(province !== '' && district !== '' && ward !== '' && numberAddress !== '' && phone !== '')
    }, [province, district, ward, numberAddress, phone])
    const validate = () => {
        let resultPhone = true
        if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone.trim())) {
            resultPhone = true
        } else {
            toast.warning('Số điện thoại không hợp lệ')
            resultPhone = false
        }
        return resultPhone
    }

    const resetModal = () => {
        setPhone('')
        setProvince('')
        setDistrict('')
        setWard('')
        setNumberAddress('')
    }
    const token = localStorage.getItem('token')
    const handleAddNewAddress = async () => {
        if (!isFormValid) {
            toast.warning('Vui lòng chọn đầy đủ thông tin địa chỉ muốn thêm')
            return
        }
        if (validate()) {
            try {
                const formattedAddress = formatAddress()
                console.log('fa', formattedAddress)
                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address',
                    { address: formattedAddress, numberPhone: phone },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                if (response.data.succes) {
                    toast.success('Thêm địa chỉ thành công')
                    resetModal()
                    setShowAddAddressModal(false)
                    fetchData()
                    if (typeof fetchDataAddress === 'function') {
                        fetchDataAddress()
                    }
                } else {
                    toast.error('Thêm địa chỉ không thành công') // 👈 check thêm nếu succes = false
                }
            } catch (error) {
                console.log('error', error)
                toast.error('Thêm địa chỉ không thành công', error)
            }
        }
    }
    const handleUpdateAddress = async (addressId) => {
        if (!isFormValid) {
            toast.warning('Vui lòng chọn đầy đủ thông tin địa chỉ để cập nhật')
            return
        }
        const formattedAddress = formatAddress()
        if (validate()) {
            try {
                const response = await axios.put(
                    `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address/${addressId}`,
                    {
                        address: formattedAddress,
                        numberPhone: phone,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                if (response.data.succes) {
                    toast.success('Cập nhật địa chỉ thành công')
                    resetModal()
                    fetchData()
                    setShowUpdateAddressModal(false)
                    if (typeof fetchDataAddress === 'function') {
                        fetchDataAddress()
                    }
                }
            } catch (error) {
                toast.error('Cập nhật địa chỉ không thành công')
            }
        }
    }
    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 px-2"
                onClick={() => {
                    if (mode === 'update') {
                        setShowUpdateAddressModal(false)
                    } else {
                        setShowAddAddressModal(false)
                    }
                }}
            >
                <div
                    className="relative mx-auto my-6 w-[95%] max-w-2xl sm:w-4/5 md:w-3/4 lg:w-2/5"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/*content*/}
                    <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                        {/*header*/}
                        <button
                            className="absolute right-4 top-4 text-red-500 hover:text-red-600"
                            type="button"
                            onClick={() => {
                                if (mode === 'update') {
                                    setShowUpdateAddressModal(false)
                                } else {
                                    setShowAddAddressModal(false)
                                }
                            }}
                        >
                            <FaWindowClose className="h-8 w-8" />
                        </button>
                        <div className="flex items-start justify-between rounded-t border-b p-5">
                            <h3 className="pr-10 text-xl font-semibold md:text-3xl">
                                {mode === 'add' ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
                            </h3>
                        </div>
                        {/*body*/}
                        <div className="w-full p-4">
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
                            <div className="flex flex-col gap-2.5">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
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
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="address">
                                        Tên đường, số nhà
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={numberAddress}
                                        placeholder="Tên đường, số nhà"
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 outline-none"
                                        onChange={(e) => setNumberAddress(e.target.value)}
                                    />
                                </div>
                                <InputReadOnly
                                    label="Địa chỉ cụ thể"
                                    value={`${numberAddress ? `${numberAddress}, ` : ''}${ward ? `${wards?.find((item) => item.code == ward)?.name},` : ''} ${district ? `${districts?.find((item) => item.code == district)?.name},` : ''} ${province ? provinces?.find((item) => item.code == province)?.name : ''}`}
                                />
                            </div>
                        </div>
                        {/*footer*/}
                        <div className=" flex items-center justify-end rounded-b border-t border-solid p-6">
                            <button
                                className="cursor-pointer rounded-md bg-black px-8 py-3 text-center text-base text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                                type="button"
                                onClick={() => {
                                    if (mode === 'update') {
                                        handleUpdateAddress(id)
                                    } else {
                                        handleAddNewAddress()
                                    }
                                }}
                            >
                                {mode === 'update' ? 'Cập nhật' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SpecificAddress
