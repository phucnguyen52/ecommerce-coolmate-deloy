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
    const navigate = useNavigate()
    const [note, setNote] = useState('')
    const fetchInformation = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/customer', {
                withCredentials: true,
            })
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
            const response = await axios.get('http://localhost:8080/api/customer/address', {
                withCredentials: true,
            })
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
            const response = await axios.get(`http://localhost:8080/api/customer/voucher?productId=${productId}`, {
                withCredentials: true,
            })
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
            console.log('orderData', orderData)
            try {
                const orderData = await prepareOrderData(selectedProducts)

                const response = await axios.post('http://localhost:8080/api/customer/order', orderData, {
                    withCredentials: true,
                })
                if (response.data.succes) {
                    toast.success('Đặt hàng thành công!', {
                        autoClose: 1000,
                    })
                }

                selectedProducts.forEach(async (item) => {
                    try {
                        const response = await axios.delete(`http://localhost:8080/api/customer/cart/${item.id}`, {
                            withCredentials: true,
                        })
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
                        `http://localhost:8080/api/customer/product/${product.ProductId}/detail`,
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
                `http://localhost:8080/api/customer/voucher/calculate?productIds=${productId}&sizes=${size}&colors=${color}&quantity=${quantity}&discountCode=${voucher.discountCode}`,
                { withCredentials: true },
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

    useEffect(() => {
        fetchCaculate()
    }, [voucher?.id])

    return (
        <div className="mx-auto w-2/3">
            <div className="flex flex-row items-center justify-center ">
                <div className="my-5 text-2xl font-bold">THANH TOÁN</div>
            </div>
            <hr className="mb-3 flex" />
            <div className="py-5">
                <div className="mb-4 flex items-center">
                    <div className="mt-2 flex items-center">
                        <FaLocationDot className="mr-1 h-6 w-6" />
                        <label htmlFor="defaultAddress" className="text-xl font-semibold">
                            Địa chỉ nhận hàng:
                        </label>
                    </div>
                </div>
                <div className=" flex">
                    <div className="flex min-w-[150px] items-center text-lg text-[#121f43]">Họ và tên</div>
                    <label htmlFor="name" className="relative">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Họ và tên"
                            className="peer resize-none rounded-lg border border-[#B1C9DC] px-3.5 py-3 font-medium leading-normal text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-slate-500 hover:border-[#121F43] focus:border-red-400 focus:ring-1 focus:ring-red-400"
                        />
                        {/* <span className="pointer-events-none absolute left-0 top-3 ml-3 bg-white px-1 text-base font-medium text-slate-400 duration-200 peer-valid:-translate-y-6 peer-valid:text-sm peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-[#2499ef]">
                            Họ và tên
                        </span> */}
                    </label>
                </div>

                <div className="mt-4 flex">
                    <label htmlFor="addressDropdown" className="flex min-w-[150px] items-center text-lg text-[#121f43]">
                        Chọn địa chỉ
                    </label>
                    <select
                        id="addressDropdown"
                        value={selectedAddress}
                        onChange={handleAddressChange}
                        className="block w-full rounded-lg border-transparent bg-gray-100 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-transparent dark:bg-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                    >
                        {addresses.map((address) => (
                            <option key={address.id} value={address.id}>
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
            <hr className="my-4 mb-3 flex" />
            <div className="mb-3 flex items-center">
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
            <hr className="mb-3 flex" />

            {selectedProducts.map((selectedProducts, index) => (
                <div className="mb-3 flex items-center" key={index}>
                    <div className="flex w-5/12 items-center">
                        <div className="w-1/3">
                            <img src={selectedProducts.image} alt="" className="rounded object-cover" />
                        </div>
                        <div className="ml-3 w-2/3">
                            <div className="mb-[2px] text-base font-semibold leading-5">
                                <div>{selectedProducts.productName}</div>
                            </div>
                            {selectedProducts.reason && (
                                <div className="text-sm italic text-red-500">{selectedProducts.reason}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex w-2/12 items-center justify-center">
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
                    <div className="flex w-2/12 justify-center">
                        {Math.round(selectedProducts.unitPrice).toLocaleString('vi-VN')}.000
                    </div>
                    <div className="flex w-1/12 justify-center">
                        <div>{selectedProducts.quantity}</div>
                    </div>
                    <div className="flex w-1/12 justify-center">
                        <div>{`${selectedProducts.discount}%`}</div>
                    </div>
                    <div className="flex w-1/12 justify-center">
                        <div className="">
                            {Math.round(
                                selectedProducts.totalPrice -
                                    (selectedProducts.totalPrice * selectedProducts.discount) / 100,
                            ).toLocaleString('vi-VN')}
                            .000
                        </div>
                    </div>
                </div>
            ))}

            <hr className="mb-3 flex" />
            <div className="mb-5">
                <div className="mb-3 text-xl font-semibold">Mã giảm giá</div>
                {vouchers?.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:h-2 ">
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
                ) : (
                    <div className="font-semibold italic">Không có voucher phù hợp</div>
                )}
            </div>
            <div className="flex justify-between rounded bg-white px-2 py-5">
                <div className="text-xl font-semibold">Phương thức thanh toán</div>
                <div className="flex flex-col">
                    <div>
                        <button
                            type="button"
                            className="mb-2 me-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex cursor-pointer items-center">
                                <CiDeliveryTruck className="mr-1 h-5 w-5" />
                                <div>Thanh toán khi nhận hàng</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            className="pointer-events-none mb-2 me-2 cursor-not-allowed rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center ">
                                <MdAppShortcut className="mr-1 h-5 w-5" />
                                <div>Quét QR bằng ứng dụng ngân hàng</div>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="pointer-events-none mb-2 me-2 cursor-not-allowed rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center">
                                <BsCreditCard className="mr-1 h-5 w-5" />
                                <div>Thẻ tín dụng / Ghi nợ</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            className="pointer-events-none mb-2 me-2 cursor-not-allowed rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center">
                                <IoWalletOutline className="mr-1 h-5 w-5" />
                                <div>Ví điện tử</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="pointer-events-none mb-2 me-2 cursor-not-allowed rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            <div className="flex items-center">
                                <img src={momo} alt="" className="mr-1 h-6 w-6" />
                                <div>Thanh toán MoMo</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <hr className="mb-3 flex" />
            <div className="p-3">
                <div className="mb-4 text-lg font-semibold">Ghi chú</div>
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
            <div className="flex justify-end">
                <div className="w-3/12">
                    <div className="mb-1 flex justify-between text-base text-slate-600">
                        <div className="">Tổng tiền hàng: </div>
                        <div>{Math.round(totalWithoutDiscount).toLocaleString('vi-VN')}.000</div>
                    </div>
                    <div className="mb-1 flex justify-between text-base text-slate-600">
                        <div className="">Giảm giá</div>
                        <div>
                            {price
                                ? price.voucherDiscount.toFixed(0)
                                : Math.round(totalDiscount).toLocaleString('vi-VN')}
                            .000
                        </div>
                    </div>
                    {/* {price?.totalDiscount && (
                        <div className="mb-1 flex justify-between text-base text-slate-600">
                            <div className="">Mã giảm giá</div>
                            <div>
                                {price?.totalDiscount ? Math.round(price.totalDiscount).toLocaleString('vi-VN') : 0}.000
                            </div>
                        </div>
                    )} */}
                    <div className="flex justify-between text-base text-slate-600">
                        <div className="">Phí vận chuyển</div>
                        <div>Miễn phí</div>
                    </div>
                </div>
            </div>
            <hr className="my-3 flex" />

            <div className="flex items-center justify-end">
                <div className="mr-2.5">Tổng thanh toán:</div>
                <div className=" text-2xl font-semibold">
                    {Math.round(sumMoney - (price?.voucherDiscount ? price.voucherDiscount : 0)).toLocaleString(
                        'vi-VN',
                    )}
                    .000
                </div>
            </div>

            <hr className="my-3 flex" />
            <div className="mb-4 flex justify-end">
                <button
                    type="submit"
                    className="text-basex min-w-48 rounded-full bg-black px-4 py-3 font-semibold text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                    onClick={handlePlaceOrder}
                >
                    Đặt hàng
                </button>
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
