/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { HiMinusSm } from 'react-icons/hi'
import { HiMiniPlus } from 'react-icons/hi2'
const ShoppingCart = ({ value, fetchCartData, onCalculate }) => {
    const [product, setProduct] = useState(null)
    const [variant, setVariant] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [filteredSizes, setFilteredSizes] = useState([])
    const [inventoryData, setInventoryData] = useState({})
    const [quantity, setQuantity] = useState(value.quantity ?? 0)

    const debounceTimeout = useRef(null)
    useEffect(() => {
        setSelectedSize(value.size || '')
        setSelectedColor(value.color || '')
    }, [value.size, value.color])

    useEffect(() => {
        if (variant.length > 0) {
            const sizesForColor = variant
                .filter((variantItem) => variantItem.color === value.color)
                .map((variantItem) => variantItem.size)
            setFilteredSizes(sizesForColor)
        }
    }, [variant])
    useEffect(() => {
        setQuantity(value.quantity)
    }, [value.quantity])
    const fetchProductData = async () => {
        if (!value || !value.ProductId) return

        try {
            const response = await axios.get(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${value.ProductId}`,
            )
            if (response.data.succes) {
                setProduct(response.data.product)
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu địa chỉ sản phẩm:', error)
        }
    }
    useEffect(() => {
        if (product) {
            const price = product.price
            const discount = product.discount
            const totalPriceWithoutDiscount = price * quantity
            const totalDiscount = ((price * discount) / 100) * quantity
            const totalPriceWithDiscount = totalPriceWithoutDiscount - totalDiscount

            onCalculate(value.id, {
                totalPriceWithoutDiscount,
                totalDiscount,
                totalPriceWithDiscount,
            })
        }
    }, [product, quantity, value.id])
    const fetchVariant = async () => {
        try {
            const response = await axios.get(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${value?.ProductId}/detail`,
            )
            if (response.data.succes) {
                setVariant(response.data.product)
                const uniqueColors = [...new Set(response.data.product.map((item) => item.color))]
                setColors(uniqueColors)
                const inventoryData = {}
                response.data.product.forEach((variantItem) => {
                    const key = `${variantItem.size}_${variantItem.color}`
                    inventoryData[key] = variantItem.quantity
                })
                setInventoryData(inventoryData)
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu địa chỉ giỏ hàng:', error)
        }
    }
    const renderInventory = () => {
        const key = `${selectedSize}_${selectedColor}`
        return inventoryData[key] || 0
    }
    // useEffect(() => {
    //     fetchProductData()
    //     fetchVariant()
    // }, [])
    useEffect(() => {
        if (value && value.ProductId) {
            fetchProductData()
            fetchVariant()
        }
    }, [value, value.ProductId])

    const handleColorChange = (e) => {
        const selectedColor = e.target.value
        setSelectedColor(selectedColor)
        setSizes(selectedSize)
        const sizesForColor = variant
            .filter((variantItem) => variantItem.color === selectedColor)
            .map((variantItem) => variantItem.size)
        setFilteredSizes(sizesForColor)
        if (sizesForColor.length > 0) {
            setSelectedSize(sizesForColor[0])
        }

        updateCartItem({
            color: selectedColor,
            size: sizesForColor.length > 0 ? sizesForColor[0] : '',
            ProductId: value.ProductId,
            quantity: quantity,
        })
        fetchCartData()
    }

    const handleSizeChange = (e) => {
        const selectedSize = e.target.value
        setSelectedSize(selectedSize)

        updateCartItem({
            color: selectedColor,
            size: selectedSize,
            ProductId: value.ProductId,
            quantity: quantity,
        })
        fetchCartData()
    }
    const token = localStorage.getItem('token')
    const updateCartItem = async (updatedData) => {
        try {
            const response = await axios.put(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/cart/${value.id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            if (response.data.succes) {
                fetchCartData()
                toast.success('Cập nhật sản phẩm thành công', {
                    autoClose: 1000,
                })
            } else {
                console.error('Cập nhật sản phẩm không thành công.')
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu cập nhật sản phẩm:', error)
        }
    }
    const handleIncreaseQuantity = () => {
        const key = `${selectedSize}_${selectedColor}`
        const availableQuantity = inventoryData[key] || 0

        if (quantity < availableQuantity) {
            setQuantity((prevQuantity) => {
                const newQuantity = prevQuantity + 1
                debounceUpdateCartItem(newQuantity)
                return newQuantity
            })
        } else {
            toast.info('Số lượng sản phẩm vượt quá số lượng sản phẩm còn lại', {
                autoClose: 1000,
            })
        }
    }
    const handleDecreaseQuantity = () => {
        setQuantity((prevQuantity) => {
            if (prevQuantity > 1) {
                const newQuantity = prevQuantity - 1
                debounceUpdateCartItem(newQuantity)
                return newQuantity
            } else {
                toast.info('Số lượng sản phẩm tối thiểu là 1', {
                    autoClose: 1000,
                })
                return prevQuantity
            }
        })
    }
    const debounceUpdateCartItem = (newQuantity) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(() => {
            updateCartItem({
                color: selectedColor,
                size: selectedSize,
                ProductId: value.ProductId,
                quantity: newQuantity,
            })
        }, 1000)
    }
    return (
        <>
            <div className={renderInventory() > 0 ? 'mx-auto w-full' : 'mx-auto w-full'}>
                {renderInventory() <= 0 && (
                    <div className="text-sm italic text-gray-500">
                        Sản phẩm này hiện đang hết hàng, bạn vui lòng lựa chọn kích thước hoặc màu sắc khác!
                    </div>
                )}

                <div
                    className={
                        renderInventory() > 0
                            ? 'flex flex-row gap-2 md:grid md:grid-cols-11 md:gap-1 lg:grid-cols-12 lg:gap-4'
                            : 'relative flex flex-row gap-2 opacity-30 md:grid md:grid-cols-11 md:gap-1 lg:grid-cols-12 lg:gap-4'
                    }
                >
                    <Link to={`/product/${value.ProductId}`} className="h-auto w-1/3 md:hidden" target="_blank">
                        {product && (
                            <img
                                src={product ? JSON.parse(product.image)[0] : '1'}
                                alt=""
                                className="flex h-full w-full items-center justify-center rounded object-cover"
                            />
                        )}
                    </Link>
                    <Link
                        to={`/product/${value.ProductId}`}
                        className="hidden h-auto md:col-span-2 md:block lg:col-span-2"
                        target="_blank"
                    >
                        {product && (
                            <img
                                src={product ? JSON.parse(product.image)[0] : '1'}
                                alt=""
                                className="h-full w-full rounded object-cover"
                            />
                        )}
                    </Link>
                    <div className="w-full md:col-span-10 md:grid md:grid-cols-12 lg:col-span-10">
                        <div className="col-span-4 flex items-center gap-2 ">
                            <div className="w-full">
                                <div className="mb-[2px] text-xs font-semibold leading-5 md:text-base ">
                                    <Link to={`/product/${value.ProductId}`} target="_blank">
                                        {product && product.product_name}
                                    </Link>
                                </div>
                                <div className="">
                                    <div className="text-xs text-slate-500 md:text-base">
                                        Số lượng còn lại: {renderInventory()}
                                    </div>
                                    <div className="mt-1 text-xs italic text-slate-500 md:text-base">
                                        Giảm giá: {product ? `${product.discount} %` : []}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={
                                renderInventory() > 0
                                    ? 'col-span-3 mb-1 mt-1 flex w-full items-center justify-start md:justify-center'
                                    : 'col-span-3 mt-1 w-full opacity-30'
                            }
                        >
                            <div className="flex flex-wrap items-center justify-start gap-2">
                                <div>
                                    <select
                                        id="color"
                                        value={selectedColor}
                                        onChange={handleColorChange}
                                        className="z-10 box-border inline-flex max-w-28 items-center justify-center rounded-xl border border-solid border-slate-200 px-1 py-1 text-xs opacity-100 md:px-2 md:py-2 md:text-base"
                                    >
                                        {colors.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedSize !== '' && (
                                    <div>
                                        <select
                                            id="size"
                                            value={selectedSize}
                                            onChange={handleSizeChange}
                                            className="z-10 box-border inline-flex max-w-28 items-center justify-center rounded-xl border border-solid border-slate-200 px-1 py-1 text-xs opacity-100 md:px-2 md:py-2 md:text-base"
                                        >
                                            {filteredSizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-5 flex grid-cols-3 items-end justify-between md:grid md:items-center">
                            {value && (
                                <div className="flex items-center justify-center md:col-span-1">
                                    <div
                                        className={
                                            renderInventory() > 0
                                                ? 'z-10 box-border inline-flex  items-center justify-center rounded-xl border border-solid border-slate-200  text-sm opacity-100 md:px-1 md:py-1 md:text-base'
                                                : 'z-10 box-border inline-flex  cursor-not-allowed items-center justify-center rounded-xl border border-solid border-slate-200 text-sm opacity-100 md:px-1 md:py-1 md:text-base'
                                        }
                                    >
                                        <button
                                            className={
                                                renderInventory() > 0
                                                    ? 'line h-full w-6 cursor-pointer items-center justify-center rounded-bl-lg rounded-tl-lg border-none p-0 text-2xl outline-none'
                                                    : 'line h-full w-6 cursor-not-allowed items-center justify-center rounded-bl-lg rounded-tl-lg border-none p-0 text-lg outline-none'
                                            }
                                            onClick={renderInventory() > 0 ? () => handleDecreaseQuantity() : null}
                                        >
                                            <HiMinusSm />
                                        </button>
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            value={quantity ?? 0}
                                            readOnly={true}
                                            className={
                                                renderInventory() > 0
                                                    ? 'm-0 h-full w-6 border-none py-1 text-center text-xs outline-none md:text-base'
                                                    : 'm-0 h-full w-6 cursor-not-allowed border-none py-1 text-center text-xs outline-none md:text-base'
                                            }
                                        />
                                        <button
                                            className={
                                                renderInventory() > 0
                                                    ? 'line h-full w-6 cursor-pointer items-center justify-center rounded-bl-lg rounded-tl-lg border-none p-0 text-lg outline-none'
                                                    : 'line h-full w-6 cursor-not-allowed items-center justify-center rounded-bl-lg rounded-tl-lg border-none p-0 text-lg outline-none'
                                            }
                                            onClick={renderInventory() > 0 ? () => handleIncreaseQuantity() : null}
                                        >
                                            <HiMiniPlus />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className=" hidden items-center justify-center md:flex ">
                                <div className="">{product ? Math.round(product.price) : ''}.000</div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div>
                                    <div className="flex flex-col">
                                        <div>
                                            {product && product.discount !== 0 && (
                                                <>
                                                    <div className="flex justify-end text-xs text-gray-500 line-through">
                                                        {product
                                                            ? Math.round(product.price * quantity).toLocaleString(
                                                                  'vi-VN',
                                                              )
                                                            : ''}
                                                        .000
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-sm font-bold text-orange-600 md:text-base">
                                            {product
                                                ? Math.round(
                                                      ((product.price * quantity) / 100) * (100 - product.discount),
                                                  ).toLocaleString('vi-VN')
                                                : 0}
                                            .000
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShoppingCart
