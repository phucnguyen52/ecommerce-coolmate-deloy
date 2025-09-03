import React, { useEffect, useState } from 'react'
import { CiDeliveryTruck } from 'react-icons/ci'
import { BsCreditCard } from 'react-icons/bs'
import { IoWalletOutline } from 'react-icons/io5'
import { MdAppShortcut } from 'react-icons/md'
import { FaLocationDot } from 'react-icons/fa6'
import momo from '../../assets/img/momo.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { FaArrowRightLong } from 'react-icons/fa6'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../layout/Main/MainLayout'
import { constructNow } from 'date-fns'
import Voucher from '../voucher/voucher'
const Purchase = () => {
    const { decreaseCount } = useContext(StoreContext)
    const [modalSuccess, setModalSuccess] = useState(false)
    const location = useLocation()
    const { selectedProducts: initSelectedProducts, sumMoney, totalDiscount, totalWithoutDiscount } = location.state
    const [selectedProducts, setSelectedProducts] = useState(initSelectedProducts)
    const [addresses, setAddresses] = useState([])
    const [name, setName] = useState('')
    const [selectedAddress, setSelectedAddress] = useState('')
    const [vouchers, setVouchers] = useState()
    const [voucher, setVoucher] = useState()
    const [price, setPrice] = useState()
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [note, setNote] = useState('')
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
            setName(response.data.user.fullName)
        } catch (error) {
            console.error('Lỗi khi fetch dữ liệu', error)
        }
    }
    const handleClick = () => {
        navigate('/user')
    }
    const handleOrder = () => {
        navigate('/order')
    }
    const [defaultAddressId, setDefaultAddressId] = useState(null)
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
                const defaultAddress = response.data.address.find((address) => address.isAddress)
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.id)
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu địa chỉ:', error)
        }
    }
    const fetchVoucher = async () => {
        const productId = selectedProducts.map((i) => i.ProductId).join(',')
        try {
            const response = await axios.get(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/voucher?productId=${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.success) {
                setVouchers(response.data.voucher)
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu địa chỉ:', error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchVoucher()
        fetchInformation()
    }, [])
    const handleAddressChange = (event) => {
        setSelectedAddress(event.target.value)
    }
    const handlePlaceOrder = async () => {
        if (addresses.length > 0) {
            if (voucher) {
                if (!price?.voucherDiscount) {
                    toast.warning('Voucher không hợp lệ')
                    return
                }
            }
            const orderData = await prepareOrderData(selectedProducts)

            try {
                const orderData = await prepareOrderData(selectedProducts)

                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/order',
                    orderData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                if (response.data.succes) {
                    toast.success('Đặt hàng thành công!', {
                        autoClose: 1000,
                    })
                }

                selectedProducts.forEach(async (item) => {
                    try {
                        const response = await axios.delete(
                            `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/cart/${item.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        if (response.status === 200) {
                            console.log('Xóa đơn hàng trong giỏ hàng thành công')
                        }
                    } catch (error) {
                        console.error('Lỗi khi gửi yêu cầu xóa đơn hàng trong giỏ hàng', error)
                    }
                })
                setModalSuccess(true)
                const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0)
                decreaseCount(totalQuantity)
            } catch (error) {
                console.error('Đã xảy ra lỗi khi gửi yêu cầu mua hàng:', error)
            }
        } else {
            toast.warning('Vui lòng thêm địa chỉ để mua hàng')
        }
    }
    let status = 1
    const prepareOrderData = async () => {
        const orderData = {
            note: note,
            quantity: [],
            ProductId: [],
            price: [],
            voucherID: price?.totalPrice ? voucher.id : null,
            totalPrice: price?.totalPrice ? Math.round(price.finalPrice) : sumMoney,
            totalVoucher:
                price?.appliedItems.length > 0 ? price?.appliedItems.reduce((sum, item) => sum + item.qty, 0) : 0,
        }

        await Promise.all(
            selectedProducts.map(async (product) => {
                try {
                    const response = await fetch(
                        `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${product.ProductId}/detail`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    )
                    const data = await response.json()

                    if (data.succes && Array.isArray(data.product)) {
                        // Tìm ProductIdDetail dựa trên color và size khớp với sản phẩm đã chọn
                        const productDetail = data.product.find(
                            (detail) => detail.color === product.color && detail.size === product.size,
                        )

                        if (productDetail) {
                            orderData.quantity.push((product.quantity * (100 - product.discount)) / 100)
                            orderData.ProductId.push(productDetail.id)
                            orderData.price.push(product.priceDiscount / product.quantity)
                        } else {
                            console.error(
                                `Không tìm thấy chi tiết sản phẩm cho màu ${product.color} và size ${product.size}`,
                            )
                        }
                    } else {
                        console.error(`Không thể lấy thông tin chi tiết cho ProductId ${product.ProductId}`)
                    }
                } catch (error) {
                    console.error(`Lỗi khi gọi API cho ProductId ${product.ProductId}:`, error)
                }
            }),
        )

        // Trả về đối tượng orderData đã hoàn thành
        return orderData
    }

    const fetchCaculate = async () => {
        if (!voucher) return

        const productId = selectedProducts.map((i) => i.ProductId).join(',')
        const size = selectedProducts.map((i) => i.size).join(',')
        const color = selectedProducts.map((i) => i.color).join(',')
        const quantity = selectedProducts.map((i) => i.quantity).join(',')

        try {
            const response = await axios.get(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/voucher/calculate?productIds=${productId}&sizes=${size}&colors=${color}&quantity=${quantity}&discountCode=${voucher.discountCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            if (response.data.success) {
                const result = response.data.result

                // 🔑 Tạo map applied & notApplied theo key duy nhất
                const makeKey = (p) => `${p.productId}-${p.size}-${p.color}`

                const appliedMap = new Map(result.appliedItems?.map((a) => [makeKey(a), a]) || [])
                const notAppliedMap = new Map(result.notApplied?.map((na) => [makeKey(na), na]) || [])

                // Merge vào selectedProducts
                const updatedProducts = selectedProducts.map((sp) => {
                    const key = `${sp.ProductId}-${sp.size}-${sp.color}`
                    const applied = appliedMap.get(key)
                    const notApplied = notAppliedMap.get(key)

                    if (applied) {
                        return {
                            ...sp,
                            discount: applied.voucherDiscountPercent,
                            priceDiscount: applied.priceAfterVoucher,
                            reason: null,
                        }
                    }

                    if (notApplied) {
                        return {
                            ...sp,
                            discount: 0,
                            priceDiscount: sp.unitPrice * sp.quantity,
                            reason: notApplied.reason,
                        }
                    }

                    return {
                        ...sp,
                        discount: 0,
                        priceDiscount: sp.unitPrice * sp.quantity,
                        reason: 'Không xác định',
                    }
                })

                setSelectedProducts(updatedProducts)
                setPrice(result)
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu tính tiền:', error)
        }
    }
    const [open, setOpen] = useState(false)
    useEffect(() => {
        fetchCaculate()
    }, [voucher?.id])
    useEffect(() => {
        if (addresses.length > 0) {
            setSelectedAddress(addresses[0])
        }
    }, [addresses])
    return (
        <div className="mx-auto w-full px-2 md:w-2/3">
            <div className="flex flex-row items-center justify-center ">
                <div className="my-3 text-xl font-bold md:my-5 md:text-2xl">THANH TOÁN</div>
            </div>
            <hr className="mb-0 flex md:mb-3" />
            <div className="px-2 py-2 md:px-0 md:py-5">
                <div className="mb-1 flex items-center justify-between md:mb-4">
                    <div className="mt-2 flex items-center justify-center">
                        <FaLocationDot className="mr-1 h-4 w-4 md:h-6 md:w-6" />
                        <label htmlFor="defaultAddress" className="text-base font-semibold md:text-xl">
                            Địa chỉ nhận hàng:
                        </label>
                    </div>
                    <div className="flex cursor-pointer text-sm text-blue-500 hover:underline md:hidden">Thay đổi</div>
                </div>
                <div className=" flex flex-row items-center md:items-center ">
                    <div className="hidden min-w-[120px] text-lg text-[#121f43] md:flex">Họ và tên</div>
                    <label htmlFor="name" className="relative">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Họ và tên"
                            className="peer resize-none rounded-lg border border-[#B1C9DC] px-2 py-1 font-medium leading-normal text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-slate-500 hover:border-[#121F43] focus:border-red-400 focus:ring-1 focus:ring-red-400 md:px-3.5 md:py-3"
                        />
                    </label>
                </div>
                <div className="relative mt-2 block w-full md:hidden">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex w-full items-center whitespace-normal break-words rounded-lg bg-gray-100 px-2 py-1 text-left text-sm"
                    >
                        <div>
                            {' '}
                            {selectedAddress
                                ? `${selectedAddress.numberPhone} - ${selectedAddress.address}`
                                : 'Chọn địa chỉ'}
                        </div>
                        <svg
                            class="ms-3 h-2.5 w-2.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 4 4 4-4"
                            />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg bg-white shadow-lg">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    value={address.id}
                                    onClick={() => {
                                        setSelectedAddress(address)
                                        setOpen(false)
                                    }}
                                    className="whitespace-normal break-words px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    {address.numberPhone} - {address.address}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 hidden md:flex">
                    <label
                        htmlFor="addressDropdown"
                        className="hidden min-w-[120px] items-center text-lg text-[#121f43] md:flex"
                    >
                        Chọn địa chỉ
                    </label>
                    <select
                        id="addressDropdown"
                        value={selectedAddress}
                        onChange={handleAddressChange}
                        className="h-full w-full whitespace-normal text-wrap break-words rounded-lg border-transparent bg-gray-100 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-transparent dark:bg-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                    >
                        {addresses.map((address) => (
                            <option key={address.id} value={address.id} className="text-wrap">
                                {address.numberPhone} {' - '}
                                {address.address}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="me-2  ml-2 flex min-w-[100px] items-center justify-center rounded-lg bg-gray-100 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-500"
                        onClick={handleClick}
                    >
                        Thay đổi
                    </button>
                </div>
            </div>
            <hr className="my-4 mb-3 hidden md:flex" />
            <div className="mb-3 hidden items-center md:flex ">
                <div className="flex w-5/12 justify-center whitespace-nowrap font-semibold">Sản phẩm</div>
                <div className="flex w-2/12 justify-center whitespace-nowrap font-semibold text-slate-600">
                    Màu sắc/Size
                </div>
                <div className="flex w-2/12 justify-center whitespace-nowrap font-semibold text-slate-600">Đơn giá</div>
                <div className="flex w-1/12 justify-center whitespace-nowrap font-semibold text-slate-600">
                    Số lượng
                </div>
                <div className="flex w-1/12 justify-center whitespace-nowrap font-semibold text-slate-600">
                    Giảm giá
                </div>
                <div className="flex w-1/12 justify-center whitespace-nowrap font-semibold text-slate-600">
                    Thành tiền
                </div>
            </div>
            <hr className="mb-4 mt-2 flex md:mb-3 md:mt-0" />

            {selectedProducts.map((selectedProducts, index) => (
                <div
                    className="mb-4 flex flex-col rounded-lg border p-3 md:flex-row md:items-center md:border-0 md:p-0"
                    key={index}
                >
                    <div className="flex w-full  md:w-5/12">
                        <div className="w-1/3">
                            <img src={selectedProducts.image} alt="" className="rounded object-cover" />
                        </div>
                        <div className="ml-3 flex w-full flex-col justify-between md:w-2/3 md:flex-row md:items-center">
                            <div>
                                <div className="mb-[2px] text-base font-semibold leading-5">
                                    <div>{selectedProducts.productName}</div>
                                </div>
                                <div className="text-sm text-slate-500 md:hidden">
                                    {selectedProducts
                                        ? selectedProducts.size === ''
                                            ? selectedProducts.color
                                            : `${selectedProducts.color} / ${selectedProducts.size}`
                                        : null}
                                </div>
                                {selectedProducts.reason && (
                                    <div className="text-sm italic text-red-500">{selectedProducts.reason}</div>
                                )}
                                <div className="flex text-sm text-slate-500 md:hidden">
                                    <div>Giảm giá:</div>
                                    <div>{`${selectedProducts.discount}%`}</div>
                                </div>
                            </div>
                            <div className="flex justify-between md:hidden">
                                <div className="flex items-baseline gap-1">
                                    <div className="text-base font-semibold text-orange-600">
                                        {Math.round(
                                            (selectedProducts.totalPrice -
                                                (selectedProducts.totalPrice * selectedProducts.discount) / 100) /
                                                selectedProducts.quantity,
                                        ).toLocaleString('vi-VN')}
                                        .000
                                    </div>

                                    <div className=" text-sm line-through">
                                        {Math.round(selectedProducts.unitPrice).toLocaleString('vi-VN')}.000
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500">x {selectedProducts.quantity}</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden w-2/12 items-center justify-center md:flex">
                        <div className="mb-2">
                            <div className="text-slate-500">
                                {selectedProducts
                                    ? selectedProducts.size === ''
                                        ? selectedProducts.color
                                        : `${selectedProducts.color} / ${selectedProducts.size}`
                                    : null}
                            </div>
                        </div>
                    </div>
                    <div className="hidden w-2/12 justify-center md:flex">
                        {Math.round(selectedProducts.unitPrice).toLocaleString('vi-VN')}.000
                    </div>
                    <div className="hidden w-1/12 justify-center md:flex">
                        <div>{selectedProducts.quantity}</div>
                    </div>
                    <div className="hidden w-1/12 justify-center md:flex">
                        <div>{`${selectedProducts.discount}%`}</div>
                    </div>
                    <hr className="my-2 md:hidden" />
                    <div className="flex justify-between md:w-1/12 md:justify-center">
                        <div className="flex text-base md:hidden">
                            Tổng số tiền ({selectedProducts.quantity} sản phẩm)
                        </div>
                        <div className="font-semibold md:font-normal">
                            {Math.round(
                                selectedProducts.totalPrice -
                                    (selectedProducts.totalPrice * selectedProducts.discount) / 100,
                            ).toLocaleString('vi-VN')}
                            .000đ
                        </div>
                    </div>
                </div>
            ))}

            <hr className="mb-3 hidden md:flex" />
            <div className="mb-0 md:mb-5">
                <div className="mb-1 text-base font-semibold md:mb-3 md:text-xl">Mã giảm giá</div>
                {vouchers?.length > 0 ? (
                    <>
                        <div
                            className="flex gap-2 overflow-x-auto pb-2 md:hidden 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                [&::-webkit-scrollbar-thumb]:bg-gray-300 
                [&::-webkit-scrollbar-track]:rounded-full 
                [&::-webkit-scrollbar-track]:bg-gray-100 
                [&::-webkit-scrollbar]:h-2"
                        >
                            {vouchers.map((v, index) => (
                                <div
                                    className={`min-w-[250px] ${
                                        voucher?.id === v.id
                                            ? 'relative cursor-default rounded-lg border-2 border-blue-400 p-1'
                                            : 'cursor-pointer p-1'
                                    }`}
                                    onClick={() => setVoucher(v)}
                                    key={index}
                                >
                                    <Voucher voucher={v} />
                                    {voucher?.id === v.id && price?.message && (
                                        <div className="absolute bottom-[-16px] text-xs italic text-red-500">
                                            Chưa đủ số lượng
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="hidden gap-2 overflow-x-auto pb-4 md:flex [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:h-2 ">
                            {vouchers.map((v, index) => (
                                <div
                                    className={
                                        voucher?.id === v.id
                                            ? 'relative cursor-default rounded-lg border-2 border-blue-400 p-1'
                                            : 'cursor-pointer p-1'
                                    }
                                    onClick={() => setVoucher(v)}
                                    key={index}
                                >
                                    <Voucher voucher={v} />
                                    {voucher?.id === v.id && price?.message && (
                                        <div className="absolute bottom-[-16px] text-xs italic text-red-500">
                                            Chưa đủ số lượng
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="font-semibold italic">Không có voucher phù hợp</div>
                )}
            </div>
            <div className="flex flex-col rounded bg-white py-0 md:flex-row md:justify-between md:py-5">
                <div className="mb-2 text-base font-semibold md:mb-0 md:text-xl">Phương thức thanh toán</div>

                <div className="flex flex-col gap-2 md:flex-col">
                    <div className="flex flex-col gap-2 md:flex-row">
                        <button
                            type="button"
                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm font-medium text-gray-900 
                           hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 md:w-auto 
                           md:px-5 md:py-2.5 dark:border-gray-600 dark:bg-gray-800 
                           dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 
                           dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center justify-center md:justify-start">
                                <CiDeliveryTruck className="mr-2 h-5 w-5" />
                                <span>Thanh toán khi nhận hàng</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="pointer-events-none w-full cursor-not-allowed rounded-lg border border-gray-300 
                           bg-white px-2 py-1.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none 
                           focus:ring-4 focus:ring-gray-100 md:w-auto md:px-5 
                           md:py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white 
                           dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center justify-center md:justify-start">
                                <MdAppShortcut className="mr-2 h-5 w-5" />
                                <span>Quét QR bằng ứng dụng ngân hàng</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row">
                        <button
                            type="button"
                            className="pointer-events-none w-full cursor-not-allowed rounded-lg border border-gray-300 
                           bg-white px-2 py-1.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none 
                           focus:ring-4 focus:ring-gray-100 md:w-auto md:px-5 
                           md:py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white 
                           dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center justify-center md:justify-start">
                                <BsCreditCard className="mr-2 h-5 w-5" />
                                <span>Thẻ tín dụng / Ghi nợ</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="pointer-events-none w-full cursor-not-allowed rounded-lg border border-gray-300 
                           bg-white px-2 py-1.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none 
                           focus:ring-4 focus:ring-gray-100 md:w-auto md:px-5 
                           md:py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white 
                           dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center justify-center md:justify-start">
                                <IoWalletOutline className="mr-2 h-5 w-5" />
                                <span>Ví điện tử</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="pointer-events-none w-full cursor-not-allowed rounded-lg border border-gray-300 
                           bg-white px-2 py-1.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none 
                           focus:ring-4 focus:ring-gray-100 md:w-auto md:px-5 
                           md:py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white 
                           dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center justify-center md:justify-start">
                                <img src={momo} alt="" className="mr-2 h-6 w-6" />
                                <span>Thanh toán MoMo</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <hr className="mb-3 hidden md:flex" />
            <div className="">
                <div className="my-2 text-base font-semibold md:mb-4 md:text-xl">Ghi chú</div>
                <textarea
                    type="text"
                    name=""
                    required
                    rows="2"
                    placeholder="Ghi chú"
                    className="peer w-full resize-none text-wrap rounded-lg border border-[#B1C9DC] px-3.5 py-4 font-medium leading-5 text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-[#90a6bc] hover:border-[#121F43] focus:border-[#2499ef] focus:ring-1 focus:ring-[#2499ef]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
            </div>
            <hr className="my-3 flex" />
            <div className="flex flex-col md:flex-row md:justify-end">
                <div className="mb-2 font-semibold md:hidden">Chi tiết thanh toán</div>
                <div className="md:w-3/12">
                    <div className="mb-1 flex justify-between text-sm text-slate-600 md:text-base">
                        <div className="">Tổng tiền hàng: </div>
                        <div>{Math.round(totalWithoutDiscount).toLocaleString('vi-VN')}.000</div>
                    </div>
                    <div className="mb-1 flex justify-between text-sm text-slate-600 md:text-base">
                        <div className="">Giảm giá</div>
                        <div>
                            {price
                                ? price.voucherDiscount.toFixed(0)
                                : Math.round(totalDiscount).toLocaleString('vi-VN')}
                            .000
                        </div>
                    </div>
                    {/* {price?.totalDiscount && (
                        <div className="mb-1 flex justify-between text-sm md:text-base text-slate-600">
                            <div className="">Mã giảm giá</div>
                            <div>
                                {price?.totalDiscount ? Math.round(price.totalDiscount).toLocaleString('vi-VN') : 0}.000
                            </div>
                        </div>
                    )} */}
                    <div className="flex justify-between text-sm text-slate-600 md:text-base">
                        <div className="">Phí vận chuyển</div>
                        <div>Miễn phí</div>
                    </div>
                </div>
            </div>
            <hr className="my-3 flex" />

            <div className="mb-5 flex items-center justify-between md:justify-end">
                <div className="mr-2.5 text-sm md:text-lg">Tổng thanh toán:</div>
                <div className="text-lg font-semibold md:text-2xl">
                    {Math.round(sumMoney - (price?.voucherDiscount ? price.voucherDiscount : 0)).toLocaleString(
                        'vi-VN',
                    )}
                    .000
                </div>
            </div>

            <hr className="my-3 hidden md:flex" />
            <div className="mb-4 hidden justify-end md:flex">
                <button
                    type="submit"
                    className="min-w-48 rounded-full bg-black px-4 py-3 text-base font-semibold text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                    onClick={handlePlaceOrder}
                >
                    Đặt hàng
                </button>
            </div>
            <div className="fixed bottom-0 left-0 z-40 w-screen border-t bg-white p-3 md:hidden">
                <div className="flex w-full items-center justify-end md:justify-between">
                    <div className="mr-4 flex items-center justify-center">
                        <div className="mr-2.5 text-sm md:text-lg">Tổng cộng:</div>
                        <div className="text-lg font-semibold md:text-2xl">
                            {Math.round(sumMoney - (price?.voucherDiscount ? price.voucherDiscount : 0)).toLocaleString(
                                'vi-VN',
                            )}
                            .000đ
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="rounded-md bg-black px-4 py-2 text-base font-semibold text-white hover:bg-neutral-300 hover:text-black hover:transition-all md:min-w-48 md:rounded-full md:px-4 md:py-3"
                        onClick={handlePlaceOrder}
                    >
                        Đặt hàng
                    </button>
                </div>
            </div>
            {/* modal */}
            {modalSuccess ? (
                <>
                    <div className="fixed inset-0 z-[1000] flex h-full w-full flex-wrap items-center justify-center overflow-auto p-4 font-[sans-serif] before:fixed before:inset-0 before:h-full before:w-full before:bg-[rgba(0,0,0,0.5)]">
                        <div className="relative w-full max-w-lg rounded-md bg-white p-6 shadow-lg">
                            <div className="my-8 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline w-16 shrink-0 fill-[#333]"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z"
                                        data-original="#000000"
                                    />
                                    <path
                                        d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z"
                                        data-original="#000000"
                                    />
                                </svg>
                                <h4 className="mt-6 text-2xl font-semibold text-[#333]">Đặt hàng thành công!</h4>
                                <p className="">
                                    <div className="mt-3 flex justify-end text-sm">
                                        <div>
                                            Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả
                                            lại sản phẩm.
                                            <span className="ml-1 font-semibold">
                                                Tìm hiểu thêm{' '}
                                                <a href="!#" className="underline" target="_blank">
                                                    tại đây
                                                </a>
                                                .
                                            </span>
                                        </div>
                                    </div>
                                </p>
                            </div>
                            <button
                                type="button"
                                className="flex w-full min-w-[150px] items-center justify-center rounded border-none bg-[#333] px-6 py-2.5 text-sm font-semibold text-white outline-none hover:bg-[#222]"
                                onClick={handleOrder}
                            >
                                <FaArrowRightLong />
                                <div className="ml-2">Đơn mua</div>
                            </button>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default Purchase
