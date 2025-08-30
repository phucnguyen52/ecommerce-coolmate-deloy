import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineStarPurple500 } from 'react-icons/md'
import { useContext, useEffect, useState } from 'react'
import './productCart.css'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { StoreContext } from '../../layout/Main/MainLayout'

function ProductCard(props) {
    const { value } = props
    const { fetchCart } = useContext(StoreContext)
    const navigate = useNavigate()
    const [variant, setVariant] = useState()
    const [rating, setRating] = useState()

    const images = JSON.parse(value?.image)
    const [color, setColor] = useState()
    const checkSize = (variant) => {
        const check = variant.filter((item) => item.size.trim() !== '').length
        return check ? true : false
    }
    const fetchRating = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/rating/${value.id}`,
            )

            const res = await req.json()
            if (res.succes) {
                const count = res.rating[0].totalRecords
                const total = res.rating[0].totalStars
                setRating({
                    count: count,
                    point: count !== 0 ? (total / count).toFixed(1) : 0,
                })
            } else {
                console.error('Rating success false')
            }
        } catch {
            navigate('/error')
        }
    }
    const fetchVariant = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${value.id}/detail`,
            )
            const res = await req.json()

            if (res.succes && Array.isArray(res.product) && res.product.length > 0) {
                setVariant(res.product)
                setColor(res.product[0].color)
            } else {
                console.error('variant success false')
            }
        } catch {
            navigate('/error')
        }
    }

    useEffect(() => {
        fetchRating()
    }, [])
    useEffect(() => {
        fetchVariant()
    }, [value])

    const handleClick = (item) => {
        if (color !== item) setColor(item)
    }
    const handleAdd = async (size) => {
        const addProduct = {
            color: color,
            size: size,
            quantity: 1,
            ProductId: value.id,
        }
        const userDataString = Cookies.get('token')
        if (!userDataString) {
            toast.warning('Vui lòng đăng nhập')
            return 0
        }
        try {
            const req = await fetch(`https://ecommerce-coolmate-server-production.up.railway.app/api/customer/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: true,
                body: JSON.stringify(addProduct),
            })

            const res = await req.json()
            if (res.succes) {
                toast.success('Thêm vào giỏ hàng thành công', {
                    autoClose: 1000,
                })
                fetchCart()
            }
        } catch (error) {
            navigate('/error')
            throw error
        }
    }

    return (
        <>
            <div className="relative h-full w-full">
                {variant
                    ? variant.every((item) => item.quantity === 0) && (
                          <div className="absolute z-10 flex h-full w-full items-center justify-center rounded-lg bg-black text-[50px] text-white opacity-50">
                              HẾT HÀNG
                          </div>
                      )
                    : null}

                <div className="product-img relative block h-[70%] ">
                    <Link to={`/product/${value.id}`}>
                        <img className="relative h-full w-full rounded-lg object-cover" src={images[1]} />

                        <img
                            className="absolute left-0 top-0 h-full w-full rounded-lg object-cover hover:opacity-0"
                            src={images[0]}
                        />
                    </Link>

                    {variant && (
                        <div
                            className="product-add absolute bottom-0 left-0 right-0 m-auto w-full rounded-lg bg-black bg-opacity-10 p-4 text-center text-sm opacity-0 backdrop-blur-[20px]"
                            style={{ maxWidth: `calc(100% - 3rem)` }}
                        >
                            {checkSize(variant) ? (
                                <>
                                    <div className="mb-3 font-bold">Thêm nhanh vào giỏ hàng</div>
                                    <div className="flex flex-wrap-reverse gap-1">
                                        {variant
                                            .filter((item) => item.color === color && item.quantity > 0)
                                            .map((item, index) => (
                                                <button
                                                    key={index}
                                                    className="flex h-8 w-10 items-center justify-center rounded-lg bg-white hover:bg-black hover:text-white"
                                                    onClick={() => handleAdd(item.size)}
                                                >
                                                    {item.size}
                                                </button>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3 cursor-pointer font-bold" onClick={() => handleAdd('')}>
                                        Thêm nhanh vào giỏ hàng
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* RATING */}
                    <div className="absolute left-2.5 top-1.5 flex items-center gap-px text-sm">
                        <div className="">{rating?.point}</div>
                        <MdOutlineStarPurple500 className="text-sm" />
                        <div className="font-semibold text-blue-600">({rating?.count})</div>
                    </div>
                </div>

                {/* MÀU SẮC */}
                {variant && (
                    <div className="flex flex-wrap gap-1 py-3">
                        {[...new Set(variant.map((item) => item.color))].map((item) => {
                            return (
                                <div
                                    onClick={() => handleClick(item)}
                                    key={item}
                                    className={`${color === item ? 'border-black font-bold ' : ' '} border-gray cursor-pointer rounded-md border border-solid p-1 text-sm hover:border-black`}
                                >
                                    {item}
                                </div>
                            )
                        })}
                    </div>
                )}
                <Link>
                    <div className="pb-2 text-base text-[#231f20]">{value.nameProduct}</div>
                </Link>
                {value.discount ? (
                    <div className="flex text-sm">
                        <div className="font-bold text-[#242424]">
                            {((value.price * (100 - value.discount)) / 100).toFixed()}.000đ
                        </div>
                        <del className=" px-3 text-gray-400">{value.price}.000đ</del>
                        <div className="text-red-500">{value.discount}%</div>
                    </div>
                ) : (
                    <div className="font-bold text-[#242424]">{value.price}.000đ</div>
                )}
            </div>
        </>
    )
}
export default ProductCard
