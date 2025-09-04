import React, { useEffect, useState } from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { apiGetPublicDistrict, apiGetPublicProvinces, apiGetPublicWard } from '../../services/app'
import axios from 'axios'
import { toast } from 'react-toastify'
import SpecificAddress from '../../components/Address'
import { set } from 'date-fns'
const ModalAllAddress = ({ setShowModalAddress, fetchDataAddress }) => {
    const [idd, setIdd] = useState(null)
    const token = localStorage.getItem('token')
    const [addresses, setAddresses] = useState([])
    const [showAddAddressModal, setShowAddAddressModal] = useState(false)
    const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false)
    const [provinces, setProvinces] = useState([])
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')
    const [numberAddress, setNumberAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [addressId, setAddressId] = useState(null)
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
    const cleanAddress = (address) => {
        let parts = address.split(', ')
        let cleanedParts = parts.filter((part) => part.toLowerCase() !== 'undefined')
        let cleanedAddress = cleanedParts.join(', ')
        return cleanedAddress
    }
    const handleAddAddress = () => {
        setShowAddAddressModal(true)
    }

    const handleUpdateAddress = async (addressId) => {
        setAddressId(addressId)
        setLoading(true)
        const addressToUpdate = addresses.find((address) => address.id === addressId)

        setIdd(addressToUpdate.id)
        setPhone(addressToUpdate.numberPhone)
        const updateAddress = addressToUpdate.address

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
        console.log('Found Province:', foundProvince.code)
        if (!foundProvince) return
        setProvince(foundProvince.code)

        const districtRes = await apiGetPublicDistrict(foundProvince.code)
        console.log('District Response:', districtRes)
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
        setShowUpdateAddressModal(true)
        setLoading(false)
    }

    const handleDeleteAddress = async (addressId) => {
        try {
            const updatedAddresses = addresses.filter((address) => address.id !== addressId)
            const response = await axios.delete(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address/${addressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.succes) {
                setAddresses(updatedAddresses)
                if (typeof fetchDataAddress === 'function') {
                    fetchDataAddress()
                }
                toast.success('Xóa địa chỉ thành công', { autoClose: 1000 })
            }
        } catch (error) {
            console.error('Xóa địa chỉ không thành công', error)
        }
    }
    const handleSetDefaultAddress = async (addressId) => {
        try {
            const response = await axios.put(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/address/${addressId}`,
                { isAddress: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.succes) {
                fetchData()
                if (typeof fetchDataAddress === 'function') {
                    fetchDataAddress()
                }
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', error)
        }
    }
    return (
        <>
            {!showAddAddressModal && !showUpdateAddressModal && (
                <div>
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 px-2"
                        onClick={() => setShowModalAddress(false)}
                    >
                        <div className="relative mx-auto my-6 w-full lg:w-3/5" onClick={(e) => e.stopPropagation()}>
                            {/*content*/}
                            <div className="relative flex max-h-[80vh] w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/*header*/}
                                <button
                                    className="absolute right-4 top-4 text-red-500 hover:text-red-600"
                                    type="button"
                                    onClick={() => setShowModalAddress(false)}
                                >
                                    <FaWindowClose className="h-8 w-8" />
                                </button>
                                <div className="flex items-start justify-between rounded-t border-b p-5">
                                    <h3 className="pr-10 text-xl font-semibold md:text-3xl">Địa chỉ của người dùng</h3>
                                </div>
                                {/*body*/}
                                <div className="relative flex-auto overflow-y-auto p-6">
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
                                                        onClick={() => {
                                                            handleUpdateAddress(data.id)
                                                        }}
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
                </div>
            )}
            {showAddAddressModal && (
                <SpecificAddress
                    setShowAddAddressModal={setShowAddAddressModal}
                    fetchDataAddress={fetchDataAddress}
                    fetchData={fetchData}
                    mode="add"
                />
            )}
            {showUpdateAddressModal && (
                <SpecificAddress
                    fetchDataAddress={fetchDataAddress}
                    fetchData={fetchData}
                    setShowUpdateAddressModal={setShowUpdateAddressModal}
                    addressId={addressId}
                    numberPhone={phone}
                    provinceName={province}
                    districtName={district}
                    wardName={ward}
                    numberAddressName={numberAddress}
                    mode="update"
                />
            )}
        </>
    )
}

export default ModalAllAddress
