import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { HiMiniShoppingBag } from 'react-icons/hi2'
import { GiEmptyHourglass } from 'react-icons/gi'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
const PurchaseOrder = () => {
    const [groupedOrders, setGroupedOrders] = useState([])
    const [currentStatus, setCurrentStatus] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showRateModal, setShowRateModal] = useState(false)
    const [rating, setRating] = useState(null)
    const [hover, setHover] = useState(null)
    const [comment, setComment] = useState('')

    const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null)
    const ratingDescriptions = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời']
    const [ratingDescription, setRatingDescription] = useState('')
    const token = localStorage.getItem('token')
    const [orderCounts, setOrderCounts] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    })

    const fetchAllOrders = async () => {
        try {
            const statuses = [1, 2, 3, 4]

            const promises = statuses.map((status) =>
                axios.get(`https://ecommerce-coolmate-server-production.up.railway.app/api/customer/order/${status}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            )

            const responses = await Promise.all(promises)

            const counts = {}
            statuses.forEach((status, idx) => {
                const res = responses[idx].data
                counts[status] = res.succes ? res.order.length : 0
            })
            console.log('Order counts:', counts) // Debugging line
            setOrderCounts(counts)
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [token])

    const fetchOrdersByStatus = async (status) => {
        try {
            const response = await axios.get(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/order/${status}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            const orders = response.data.order

            if (response.data.succes) {
                const sortedOrders = orders.sort((a, b) => b.id - a.id)
                console.log('Fetched orders:', sortedOrders) // Debugging line
                setGroupedOrders(sortedOrders)
                // setCurrentStatus(status)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
    }
    const handleStatusClick = (status) => {
        fetchOrdersByStatus(status)
        setCurrentStatus(status)
    }
    useEffect(() => {
        fetchOrdersByStatus(1)
        setCurrentStatus(1)
    }, [])
    const calculateTotalPriceByOrderId = () => {
        const totalPriceByOrderId = {}
        groupedOrders.forEach((order) => {
            const orderId = order.id
            let totalPrice = 0
            order.OrderDetail.forEach((detail) => {
                const price = detail.price
                const quantity = detail.quantity
                totalPrice += price * quantity // Multiply price by quantity
            })
            totalPriceByOrderId[orderId] = totalPrice
        })
        return totalPriceByOrderId
    }
    const totalPriceByOrderId = calculateTotalPriceByOrderId()
    const [orderIdToCancel, setOrderIdToCancel] = useState(null)
    const handleCancelOrder = (orderId) => {
        setShowModal(true)
        setOrderIdToCancel(orderId)
    }
    const cancelOrder = async () => {
        try {
            const response = await axios.delete(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/order/${orderIdToCancel}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.succes) {
                fetchOrdersByStatus(currentStatus)
                setShowModal(false)
                toast.success('Hủy đơn hàng thành công', {
                    autoClose: 1000,
                })
            }
        } catch (error) {
            console.error('Xóa đơn hàng không thành công', error)
            setShowModal(false)
        }
    }
    const handleRateProduct = (OrderDetailId) => {
        setSelectedOrderDetailId(OrderDetailId)
        setShowRateModal(true)
    }
    const [isLoading, setIsLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState()
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
    const handleRate = async (status) => {
        if (!rating || !comment || !selectedOrderDetailId) {
            toast.warning('Vui lòng nhập và chọn đầy đủ thông tin', {
                autoClose: 1000,
            })
        } else {
            const requestBody = {
                startPoint: rating,
                comment: comment,
                OrderDetailId: selectedOrderDetailId,
                image: imageUrl,
            }

            try {
                const response = await axios.post(
                    'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/rating',
                    requestBody,
                )
                const data = response.data
                if (data.succes) {
                    setRating(null)
                    setComment('')
                    setImageUrl('')
                    setHover(null)
                    setShowRateModal(false)
                    setRatingDescription(false)
                    fetchOrdersByStatus(status)
                    toast.success('Đánh giá sản phẩm thành công', {
                        autoClose: 1000,
                    })
                }
            } catch (error) {
                toast.warning('Bạn đã đánh giá sản phẩm này', {
                    autoClose: 1000,
                })
            }
        }
    }

    return (
        <div className="mx-auto w-full md:w-2/3">
            <div className="flex flex-row items-center justify-center">
                <HiMiniShoppingBag className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                <div className="my-5 text-xl font-bold md:text-2xl">ĐƠN MUA</div>
            </div>
            <hr className="mb-3 flex" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <a
                    onClick={() => handleStatusClick(1)}
                    className={`group text-center text-black transition-all duration-300 ease-in-out focus:text-pink-500 ${
                        currentStatus === 1 && 'text-pink-500'
                    }`}
                    href="#"
                >
                    <span className="inline-flex items-center gap-1 text-nowrap">
                        CHỜ XÁC NHẬN
                        <span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white md:px-2 md:py-0.5">
                            {orderCounts[1] || 0}
                        </span>
                    </span>
                </a>

                <a
                    onClick={() => handleStatusClick(2)}
                    className={`group text-center text-black transition-all duration-300 ease-in-out focus:text-pink-500 ${
                        currentStatus === 2 && 'text-pink-500'
                    }`}
                    href="#"
                >
                    <span className="inline-flex items-center gap-1 text-nowrap">
                        CHỜ VẬN CHUYỂN
                        <span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white md:px-2 md:py-0.5">
                            {orderCounts[2] || 0}
                        </span>
                    </span>
                </a>

                <a
                    onClick={() => handleStatusClick(3)}
                    className={`group text-center text-black transition-all duration-300 ease-in-out focus:text-pink-500 ${
                        currentStatus === 3 && 'text-pink-500'
                    }`}
                    href="#"
                >
                    <span className="inline-flex items-center gap-1 text-nowrap">
                        ĐANG GIAO HÀNG
                        <span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white md:px-2 md:py-0.5">
                            {orderCounts[3] || 0}
                        </span>
                    </span>
                </a>

                <a
                    onClick={() => handleStatusClick(4)}
                    className={`group text-center text-black transition-all duration-300 ease-in-out focus:text-pink-500 ${
                        currentStatus === 4 && 'text-pink-500'
                    }`}
                    href="#"
                >
                    <span className="inline-flex items-center gap-1 text-nowrap">
                        ĐÃ GIAO
                        <span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white md:px-2 md:py-0.5">
                            {orderCounts[4] || 0}
                        </span>
                    </span>
                </a>
            </div>

            <hr className="my-3 flex" />
            <div>
                {currentStatus && groupedOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-40">
                        <GiEmptyHourglass className="my-2 h-10 w-10" />
                        <div className="text-center text-xl text-gray-500">Chưa có đơn hàng</div>
                    </div>
                )}
                {currentStatus && groupedOrders && (
                    <div>
                        {groupedOrders.map((group, idx) => (
                            <div key={idx} className="mx-2 mb-6 rounded-md bg-gray-200/60">
                                <div>
                                    <div className="text-md hidden items-center justify-between py-2 md:flex">
                                        <div
                                            className={
                                                currentStatus !== 4
                                                    ? 'w-5/12 items-center whitespace-nowrap text-center font-semibold'
                                                    : 'w-4/12 items-center whitespace-nowrap text-center font-semibold'
                                            }
                                        >
                                            Sản phẩm
                                        </div>
                                        <div
                                            className={
                                                currentStatus !== 4
                                                    ? 'ml-8 w-2/12 items-center whitespace-nowrap text-center font-semibold'
                                                    : 'ml-28 w-2/12 items-center whitespace-nowrap text-center font-semibold'
                                            }
                                        >
                                            Màu sắc / Size
                                        </div>

                                        <div
                                            className={
                                                currentStatus !== 4
                                                    ? 'ml-0 w-1/12 items-center whitespace-nowrap text-center font-semibold text-slate-700'
                                                    : 'ml-0 w-1/12 items-center whitespace-nowrap text-center font-semibold text-slate-700'
                                            }
                                        >
                                            Số lượng
                                        </div>

                                        <div
                                            className={
                                                currentStatus !== 4
                                                    ? 'mr-8 w-1/12 items-center whitespace-nowrap text-center font-semibold text-slate-700'
                                                    : 'mr-3 w-1/12 items-center whitespace-nowrap text-center font-semibold text-slate-700'
                                            }
                                        >
                                            Thành tiền
                                        </div>
                                        {currentStatus === 4 && (
                                            <div className="mr-2 w-1/12 items-center whitespace-nowrap text-center font-semibold text-slate-700">
                                                Thao tác
                                            </div>
                                        )}
                                    </div>
                                    <hr className="flex" />
                                    {group.OrderDetail.map((order, orderIdx) => (
                                        <div
                                            className="flex flex-col border-b p-3 md:flex-row md:items-center md:justify-around"
                                            key={orderIdx}
                                        >
                                            {/* Hình + tên sp */}
                                            <div className="flex w-full items-center justify-between md:w-5/12">
                                                <Link
                                                    to={`/product/${order.productID}`}
                                                    target="_blank"
                                                    className="w-1/3 md:w-1/4"
                                                >
                                                    <img
                                                        src={JSON.parse(order.picture)[0]}
                                                        alt=""
                                                        className="h-36 w-full rounded border object-cover"
                                                    />
                                                </Link>
                                                <div className="ml-3 flex w-2/3 flex-col md:w-3/4 md:flex-col">
                                                    <div className="mb-1 text-base font-semibold leading-5">
                                                        {order.product}
                                                    </div>
                                                    <div className="flex flex-nowrap gap-2 text-sm text-slate-500 md:hidden">
                                                        <div>Màu sắc/Kích thước:</div>
                                                        <span>
                                                            {order.color ? (
                                                                order.color
                                                            ) : (
                                                                <span className="italic">/(Không có)</span>
                                                            )}
                                                            {order.color && order.size ? ' / ' : ''}
                                                            {order.size ? (
                                                                order.size
                                                            ) : (
                                                                <span className="italic">/(Không có)</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-slate-700 md:hidden">
                                                        Số lượng: {order.quantity}
                                                    </div>
                                                    <div className="flex flex-nowrap gap-2 text-sm font-bold text-orange-600 md:hidden">
                                                        <div className="text-slate-700">Thành tiền: </div>
                                                        {Math.round(order.price * order.quantity).toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                        .000
                                                    </div>
                                                    <div className="flex w-full justify-end">
                                                        {currentStatus === 4 && (
                                                            <button
                                                                onClick={() => handleRateProduct(order.orderDetailID)}
                                                                className="mt-1 flex w-2/5 select-none justify-center rounded-lg border border-gray-900 px-3 py-2 text-xs font-bold text-gray-900 hover:opacity-75 md:hidden"
                                                            >
                                                                Đánh giá
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tablet/Desktop columns */}
                                            <div className="hidden w-2/12 items-center justify-center md:flex">
                                                <div className="text-slate-500">
                                                    {order.color ? (
                                                        order.color
                                                    ) : (
                                                        <span className="italic">/(Không có)</span>
                                                    )}
                                                    {order.color && order.size ? ' / ' : ''}
                                                    {order.size ? (
                                                        order.size
                                                    ) : (
                                                        <span className="italic">/(Không có)</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="hidden w-1/12 justify-center md:flex">{order.quantity}</div>
                                            <div className="hidden w-1/12 justify-center font-bold text-orange-600 md:flex">
                                                {Math.round(order.price * order.quantity).toLocaleString('vi-VN')}.000
                                            </div>

                                            {/* Nút đánh giá chỉ hiện trên desktop khi currentStatus = 4 */}
                                            {currentStatus === 4 && (
                                                <button
                                                    onClick={() => handleRateProduct(order.orderDetailID)}
                                                    className="ml-0 mt-2 flex hidden select-none rounded-lg border border-gray-900 px-3 py-2 text-xs font-bold text-gray-900 hover:opacity-75 md:ml-3 md:mt-0 md:flex"
                                                >
                                                    Đánh giá
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <hr className="mb-3 flex" />
                                <div className="flex flex-col items-start justify-between gap-1 px-3 pb-3 md:flex-row md:items-center md:px-6">
                                    <div className="text-sm text-slate-500">
                                        Thời gian đặt hàng:{' '}
                                        {format(new Date(group.OrderDetail[0].dayOrder), 'dd/MM/yyyy HH:mm')}
                                    </div>
                                    <div className="flex w-full flex-row items-start items-center justify-between gap-3 md:w-auto md:flex-row md:items-center md:pr-4">
                                        <div className="text-base font-semibold text-sky-800 md:text-lg">
                                            Tổng: {Math.round(totalPriceByOrderId[group.id]).toLocaleString('vi-VN')}
                                            .000
                                        </div>
                                        {currentStatus === 1 && (
                                            <button
                                                onClick={() => handleCancelOrder(group.id)}
                                                className="select-none rounded-lg border border-gray-900 px-4 py-2 text-xs font-bold uppercase text-gray-900 hover:opacity-75"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {showModal && (
                                    <div
                                        id="popup-modal"
                                        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-10 p-4"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <div
                                            className="relative w-full max-w-sm rounded-lg bg-white shadow-lg sm:max-w-md md:max-w-lg"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Nút đóng */}
                                            <button
                                                type="button"
                                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                                                onClick={() => setShowModal(false)}
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

                                            {/* Nội dung */}
                                            <div className="p-6 text-center">
                                                <svg
                                                    className="mx-auto mb-4 h-12 w-12 text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                                <h3 className="mb-5 text-base font-medium text-gray-700 sm:text-lg">
                                                    Bạn có chắc muốn hủy đơn hàng này không?
                                                </h3>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => cancelOrder()}
                                                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
                                                    >
                                                        Có, chắc chắn
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Không, quay lại
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showRateModal && (
                                    <div
                                        id="rate-product-modal"
                                        className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-10 p-3 sm:p-0"
                                        onClick={() => {
                                            setShowRateModal(false)
                                            setRating(null)
                                            setHover(null)
                                            setComment('')
                                            setRatingDescription('')
                                            setRating(null)
                                            setImageUrl('')
                                        }}
                                    >
                                        <div
                                            className="relative max-h-full w-full max-w-xl rounded-lg bg-white p-4 shadow"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    className="absolute right-[-16px] top-[-16px] flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                                                    onClick={() => {
                                                        setShowRateModal(false)
                                                        setRating(null)
                                                        setHover(null)
                                                        setComment('')
                                                        setRatingDescription('')
                                                        setRating(null)
                                                        setImageUrl('')
                                                    }}
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
                                                <div className="text-center md:p-5">
                                                    <div className="mb-2 text-lg font-bold sm:text-xl md:mb-4 md:text-2xl">
                                                        ĐÁNH GIÁ SẢN PHẨM
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="textsm min-w-40 md:text-base">
                                                            Chất lượng sản phẩm
                                                        </div>
                                                        <div className="ml-4 flex">
                                                            {[...Array(5)].map((star, index) => {
                                                                const currentRating = index + 1
                                                                return (
                                                                    <div key={index}>
                                                                        <label>
                                                                            <input
                                                                                type="radio"
                                                                                name="rating"
                                                                                value={currentRating}
                                                                                className="hidden"
                                                                                onClick={() => {
                                                                                    setRating(currentRating)
                                                                                    setRatingDescription(
                                                                                        ratingDescriptions[
                                                                                            currentRating - 1
                                                                                        ],
                                                                                    )
                                                                                }}
                                                                            />
                                                                            <FaStar
                                                                                color={
                                                                                    currentRating <= (hover || rating)
                                                                                        ? '#ffc107'
                                                                                        : '#e4e5e9'
                                                                                }
                                                                                className={`cursor-pointer 
              text-2xl sm:text-3xl md:text-3xl`}
                                                                                onClick={() => setHover(currentRating)}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="ml-4 min-w-10">{ratingDescription}</div>
                                                    </div>
                                                    <div className="my-4 flex">
                                                        <textarea
                                                            type="text"
                                                            name=""
                                                            required
                                                            rows="3"
                                                            placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
                                                            className="peer w-full resize-none text-wrap rounded-lg border border-[#B1C9DC] px-3.5 py-4 font-medium leading-5 text-[#121F43] outline-none duration-200 placeholder:text-base placeholder:text-[#90a6bc] hover:border-[#121F43] focus:border-[#2499ef] focus:ring-1 focus:ring-[#2499ef]"
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="my-4">
                                                        <div className="flex items-center justify-center ">
                                                            {isLoading ? (
                                                                <div
                                                                    role="status"
                                                                    className="flex items-center justify-center"
                                                                >
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
                                                                        onClick={() =>
                                                                            document
                                                                                .getElementById('image-upload')
                                                                                .click()
                                                                        }
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
                                                                            className="h-[120px] w-[120px] rounded-sm object-cover sm:h-[150px] sm:w-[150px]"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="mt-4 flex justify-center">
                                                                    {' '}
                                                                    <div className="h-[120px] w-[120px] border-2 border-dashed sm:h-[150px] sm:w-[150px]"></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRate()}
                                                        className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                                                    >
                                                        Đánh giá
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                                                        onClick={() => {
                                                            setShowRateModal(false)
                                                            setRating(null)
                                                            setHover(null)
                                                            setComment('')
                                                            setRatingDescription('')
                                                            setRating(null)
                                                            setImageUrl()
                                                        }}
                                                    >
                                                        Quay lại
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PurchaseOrder
