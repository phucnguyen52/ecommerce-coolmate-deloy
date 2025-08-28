import { useState, useEffect } from 'react'
import axios from 'axios'

const ProductDropdowns = ({
    productId,
    handleSizeChange,
    handleColorChange,
    defaultSize,
    defaultColor,
    availableSizes,
    cartItemId,
    quantity,
}) => {
    const [variantProducts, setVariantProducts] = useState([])
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])
    const [selectedSize, setSelectedSize] = useState(defaultSize || '')
    const [selectedColor, setSelectedColor] = useState(defaultColor || '')
    const [inventoryData, setInventoryData] = useState({})

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${productId}`, {
                    withCredentials: true,
                })
                if (response.data.succes) {
                    const { product } = response.data
                    if (product && product.VariantProducts) {
                        setVariantProducts(product.VariantProducts)
                        const inventory = {}
                        product.VariantProducts.forEach((variant) => {
                            const key = `${variant.size}_${variant.color}`
                            inventory[key] = variant.quantity
                        })
                        setInventoryData(inventory)
                    }
                }
            } catch (error) {
                console.error('Error fetching product data:', error)
            }
        }

        fetchProductData()
    }, [productId])

    useEffect(() => {
        if (selectedColor && variantProducts) {
            const availableSizesForColor = availableSizes(selectedColor, variantProducts)
            setSizes(availableSizesForColor)
        }
    }, [selectedColor, variantProducts])

    useEffect(() => {
        const uniqueSizes = [...new Set(variantProducts.map((variant) => variant.size))]
        setSizes(uniqueSizes)

        const uniqueColors = [...new Set(variantProducts.map((variant) => variant.color))]
        setColors(uniqueColors)
    }, [variantProducts])
    useEffect(() => {
        setSelectedSize(defaultSize || '')
        setSelectedColor(defaultColor || '')
    }, [defaultSize, defaultColor])

    const handleSizeSelection = (e) => {
        const newSize = e.target.value
        setSelectedSize(newSize)
        handleSizeChange(productId, newSize, selectedColor, cartItemId, quantity)
    }
    useEffect(() => {
        if (selectedColor && variantProducts) {
            const availableSizesForColor = availableSizes(selectedColor, variantProducts)
            setSizes(availableSizesForColor)
            if (!availableSizesForColor.includes(selectedSize)) {
                setSelectedSize(availableSizesForColor[0])
                handleSizeChange(productId, availableSizesForColor[0], selectedColor, cartItemId)
            }
        }
    }, [selectedColor, variantProducts])
    useEffect(() => {
        // Đặt selectedSize thành defaultSize khi defaultSize thay đổi
        setSelectedSize(defaultSize || '')
    }, [defaultSize])

    const handleColorSelection = (e) => {
        const newColor = e.target.value
        setSelectedSize(colors[0])
        setSelectedColor(newColor)
        handleColorChange(productId, newColor, selectedSize, selectedColor, quantity)
    }

    const renderInventory = () => {
        const key = `${selectedSize}_${selectedColor}`
        return inventoryData[key] || 0
    }

    return (
        <div className="flex flex-col">
            <div>
                <select
                    value={selectedColor}
                    onChange={handleColorSelection}
                    className="mr-2 box-border inline-flex h-[44px] min-w-[100px] max-w-28 items-center justify-center rounded-[100vmax] border border-solid border-slate-200"
                >
                    {colors.map((color) => (
                        <option key={color} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
                {selectedSize !== '' && (
                    <select
                        value={selectedSize}
                        onChange={handleSizeSelection}
                        className="mr-2 box-border inline-flex h-[44px] min-w-[50px] max-w-14 items-center justify-center rounded-[100vmax] border border-solid border-slate-200"
                    >
                        {sizes.map((size) => (
                            <option key={size} value={size} disabled={size === ''}>
                                {size}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <span>Số lượng còn lại: {renderInventory()}</span>
        </div>
    )
}

export default ProductDropdowns
