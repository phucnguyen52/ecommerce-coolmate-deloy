/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import ShoppingCart from './ShoppingCart'
import { FaRegTrashCan } from 'react-icons/fa6'
import { HiShoppingCart } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { GiEmptyHourglass } from 'react-icons/gi'
import { StoreContext } from '../../layout/Main/MainLayout'

const ListCart = () => {
    const dataa = useContext(StoreContext)
    const [data, setData] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [checkedItems, setCheckedItems] = useState([])
    const [products, setProducts] = useState([])
    const [isEmptyCart, setIsEmptyCart] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        setIsEmptyCart(data.length === 0)
    }, [data])
    useEffect(() => {
        sumCount()
    }, [data])
    const sumCount = () => {
        let totalQuantity = 0
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((item) => {
                totalQuantity += item.quantity
            })
        }
        dataa.handleCount(totalQuantity)
        return totalQuantity
    }
    const handleSelectAll = () => {
        if (selectAll) {
            const newCheckedItems = data.map((cart) =>
                cart.quantitySub.quantity > 0 ? false : checkedItems[data.indexOf(cart)],
            )
            setCheckedItems(newCheckedItems)
            setSelectAll(false)
        } else {
            const newCheckedItems = data.map((cart) =>
                cart.quantitySub.quantity > 0 ? true : checkedItems[data.indexOf(cart)],
            )
            setCheckedItems(newCheckedItems)
            setSelectAll(true)
        }
    }

    const handleCheckboxChange = (index) => {
        const newCheckedItems = [...checkedItems]
        newCheckedItems[index] = !checkedItems[index]
        setCheckedItems(newCheckedItems)
    }

    useEffect(() => {
        const updatedCheckedItems = data.map((cart, index) => {
            return cart.quantitySub.quantity > 0 && checkedItems[index]
        })
        setCheckedItems(updatedCheckedItems)
    }, [data])
    useEffect(() => {
        const checkedItemCount = checkedItems.filter(
            (isChecked, index) => isChecked && data[index].quantitySub.quantity > 0,
        ).length
        setSelectAll(checkedItemCount === data.filter((cart) => cart.quantitySub.quantity > 0).length)
    }, [checkedItems, data])
    const fetchCartData = async () => {
        try {
            const response = await axios.get(
                'https://ecommerce-coolmate-server-production.up.railway.app/api/customer/cart',
                {
                    withCredentials: true,
                },
            )
            if (response.data.succes) {
                const cartItem = response.data.cart

                setData(cartItem)

                const filteredCartItems = cartItem.filter((item) => !item.isOrder)
                const productIds = filteredCartItems.map((cartItem) => cartItem.ProductId)
                const productRequests = productIds.map((productId) =>
                    axios.get(
                        `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${productId}`,
                        {
                            withCredentials: true,
                        },
                    ),
                )
                const productResponses = await Promise.all(productRequests)

                const productData = productResponses.map((response) => {
                    const product = response.data.product
                    const variantProducts = product.details || []
                    return { ...product, variantProducts }
                })
                setProducts(productData)
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu địa chỉ giỏ hàng:', error)
        }
    }
    const handleRemoveCartItem = async (cartItemId, index) => {
        try {
            const response = await axios.delete(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/cart/${cartItemId}`,
                {
                    withCredentials: true,
                },
            )
            if (response.status === 200) {
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                fetchCartData()
                const newCheckedItems = [...checkedItems].filter((item, i) => i !== index)

                setCheckedItems(newCheckedItems)
            } else {
                console.error('Yêu cầu xóa cartItem không thành công.')
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu xóa cartItem:', error)
        }
    }
    useEffect(() => {
        fetchCartData()
    }, [])
    const [totalPrices, setTotalPrices] = useState({})
    const handleCalculate = (id, totals) => {
        setTotalPrices((prevTotalPrices) => ({
            ...prevTotalPrices,
            [id]: totals,
        }))
    }

    const calculateTotalPriceOfCheckedItems = () => {
        let totalPrice = 0
        Object.entries(checkedItems).forEach(([index, isChecked]) => {
            if (isChecked) {
                const cartItem = data[index]
                const totals = totalPrices[cartItem.id]
                if (totals) {
                    totalPrice += totals.totalPriceWithDiscount
                }
            }
        })
        return totalPrice
    }
    const calculateTotalPriceWithoutDiscount = () => {
        let totalPrice = 0
        data.forEach((cartItem, index) => {
            if (checkedItems[index]) {
                const totals = totalPrices[cartItem.id]
                if (totals) {
                    totalPrice += totals.totalPriceWithoutDiscount
                }
            }
        })
        return totalPrice
    }

    const calculateTotalDiscount = () => {
        let totalDiscount = 0
        data.forEach((cartItem, index) => {
            if (checkedItems[index]) {
                const totals = totalPrices[cartItem.id]
                if (totals) {
                    totalDiscount += totals.totalDiscount
                }
            }
        })
        return totalDiscount
    }

    const [sumMoney, setSumMoney] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState()
    const [totalWithoutDiscount, setTotalWithoutDiscount] = useState()
    const [purchaseClicked, setPurchaseClicked] = useState(false)

    useEffect(() => {
        const totalDiscount = calculateTotalDiscount()
        setTotalDiscount(totalDiscount)
    }, [checkedItems, totalPrices])

    useEffect(() => {
        const totalWithoutDiscount = calculateTotalPriceWithoutDiscount()
        setTotalWithoutDiscount(totalWithoutDiscount)
    }, [checkedItems, totalPrices])

    useEffect(() => {
        const totalPrice = calculateTotalPriceOfCheckedItems()
        setSumMoney(totalPrice)
    }, [checkedItems, totalPrices])
    const handlePurchase = async () => {
        const selectedProducts = data
            .filter((product, index) => checkedItems[index])
            .map((cartItem) => {
                const product = products.find((p) => p.product === cartItem.ProductId)

                const productName = product ? product.product_name : 'Unknown Product'
                const image = product ? JSON.parse(product.image)[0] : 'default_image_url'
                const totalPrice = product ? product.price * cartItem.quantity : ''
                const priceDiscount = ((product.price * cartItem.quantity) / 100) * (100 - product.discount)
                return {
                    ...cartItem,
                    productName: productName,
                    unitPrice: product.price,
                    discount: product.discount,
                    image: image,
                    totalPrice: totalPrice,
                    priceDiscount: priceDiscount,
                }
            })
        if (selectedProducts.length === 0) {
            toast.warning('Vui lòng chọn sản phẩm muốn mua hàng.', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setPurchaseClicked(false)
            return
        }

        navigate('/purchase', {
            state: {
                selectedProducts: selectedProducts,
                sumMoney: sumMoney,
                totalDiscount: totalDiscount,
                totalWithoutDiscount: totalWithoutDiscount,
            },
        })
    }
    return (
        <>
            <div className=" mx-auto mt-4 w-2/3 pb-12">
                <div className="flex flex-row items-center justify-center ">
                    <HiShoppingCart className="mr-2  h-6 w-6" />
                    <div className="my-5 text-2xl font-bold">GIỎ HÀNG</div>
                </div>
                <hr className="mb-3 flex" />
                <div className="mb-3 flex">
                    <div className="inline-flex items-center">
                        <label
                            className="relative flex cursor-pointer items-center rounded-full p-3"
                            htmlFor="select-all-checkbox"
                        >
                            <input
                                id="select-all-checkbox"
                                type="checkbox"
                                className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                        </label>
                    </div>
                    <div className="grid w-full grid-cols-11 gap-1">
                        <div className="col-span-4 flex items-center gap-2 text-slate-700">Sản phẩm</div>
                        <div className="col-span-3 flex items-center justify-center text-slate-700">Màu sắc / Size</div>
                        <div className="col-span-1 flex items-center justify-center text-slate-700">Đơn giá</div>
                        <div className="col-span-3 flex items-center justify-center text-slate-700">
                            <div className="flex w-2/5 items-center justify-center">Số lượng</div>
                            <div className="flex w-2/5 justify-end">Thành tiền</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-center text-slate-700">Thao tác</div>
                </div>
                <hr className="mb-3 flex" />
                {isEmptyCart ? (
                    <div className="mb-3 flex flex-col items-center justify-center py-40">
                        <GiEmptyHourglass className="my-2 h-10 w-10" />
                        <div className="text-center text-xl text-gray-500">Giỏ hàng của bạn đang trống</div>
                    </div>
                ) : (
                    <>
                        {' '}
                        <div>
                            {data &&
                                data.map((cart, index) => (
                                    <div key={cart.id} className="flex flex-col py-5">
                                        <div className="flex">
                                            <div className="inline-flex items-center">
                                                <label
                                                    className={
                                                        cart.quantitySub.quantity > 0
                                                            ? 'relative flex items-center rounded-full p-3'
                                                            : 'relative flex cursor-not-allowed items-center rounded-full p-3'
                                                    }
                                                    htmlFor={`checkbox-${index}`}
                                                >
                                                    <input
                                                        id={`checkbox-${index}`}
                                                        type="checkbox"
                                                        className={
                                                            cart.quantitySub.quantity > 0
                                                                ? "before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                                                : "before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-not-allowed appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                                        }
                                                        checked={checkedItems[index]}
                                                        onChange={() => handleCheckboxChange(index)}
                                                        disabled={cart.quantitySub.quantity === 0}
                                                    />
                                                    <span
                                                        className={
                                                            cart.quantitySub.quantity > 0
                                                                ? 'pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100'
                                                                : 'pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 cursor-not-allowed text-white opacity-0 transition-opacity peer-checked:opacity-100'
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            stroke="currentColor"
                                                            strokeWidth="1"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </label>
                                            </div>
                                            <ShoppingCart
                                                value={cart}
                                                fetchCartData={fetchCartData}
                                                onCalculate={handleCalculate}
                                            />
                                            <div className="col-span-1 flex items-center justify-center">
                                                <button
                                                    className="flex cursor-pointer items-center"
                                                    onClick={() => handleRemoveCartItem(cart.id, index)}
                                                >
                                                    <FaRegTrashCan className="cursor-pointer" />
                                                    <div className="cursor-pointer pl-1">Xóa</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                <hr className="mb-3 flex" />
                <div className="sticky bottom-0 mb-3 flex justify-between rounded border border-solid bg-white px-2 py-5">
                    <div className="mx-8 flex items-center justify-center"></div>
                    <div className="flex">
                        <div className="mr-4 flex items-center justify-center">
                            <div className="mr-2">Tổng thanh toán:</div>
                            <div className=" text-2xl font-semibold">
                                {Math.round(calculateTotalPriceOfCheckedItems()).toLocaleString('vi-VN')}.000
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="min-w-48 rounded-full bg-black px-4 py-3 text-sm text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                            onClick={handlePurchase}
                            disabled={isEmptyCart}
                            style={{
                                cursor:
                                    isEmptyCart || checkedItems.every((item) => !item) || purchaseClicked
                                        ? 'not-allowed'
                                        : 'pointer',
                            }}
                        >
                            Mua hàng
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListCart
