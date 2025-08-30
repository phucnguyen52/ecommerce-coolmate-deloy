import { useEffect, useState, useRef, useContext } from 'react'
import Slider from 'react-slick'
import './ProductDetail.css'
import StarRating from './StarRating'
import { BiTimer } from 'react-icons/bi'
import { IoLogoDropbox } from 'react-icons/io'
import ProductReviews from './ProductReviews'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { HiArrowRight } from 'react-icons/hi'
import { HiArrowLeft } from 'react-icons/hi'
import Cookies from 'js-cookie'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ProductRelate from '../../components/product/ProductRelate'
import { StoreContext } from '../../layout/Main/MainLayout'
import images from '../../assets'
import { TiMinus } from 'react-icons/ti'
import { FaPlus } from 'react-icons/fa6'
const ProductDetail = () => {
    const { id } = useParams()
    const { fetchCart } = useContext(StoreContext)
    const [data, setData] = useState()
    const [color, setColor] = useState()
    const [productdetail, setProductDetail] = useState()
    const [size, setSize] = useState()
    const [rating, setRating] = useState()
    const [quantity, setQuantity] = useState(1)
    const [vouchers, setVouchers] = useState()
    const navigate = useNavigate()
    const imgvoucher = images.voucher
    const sizeDefault = ['S', 'M', 'L', 'XL', '2XL', '3XL']
    const [maxQuantity, setMaxQuantity] = useState(0)

    const fetchProduct = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${id}`,
            )
            const res = await req.json()
            if (res.succes) {
                setData(res.product)
            } else {
                console.error('ProductDetail: status failed')
            }
        } catch {
            console.error('Promise product rejected')
        }
    }
    const fetchProductDetail = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${id}/detail`,
            )
            const res = await req.json()
            if (res.succes) {
                const checkSize = !res.product.every((i) => i.size.trim() === '')
                setProductDetail({
                    productdetail: res.product,
                    isSize: checkSize,
                })
                if (res.product && res.product.length > 0) {
                    setColor(res.product[0].color)
                    if (!checkSize) setMaxQuantity(res.product.quantity)
                }
            } else {
                console.error('ProductDetail: status failed')
            }
        } catch {
            console.error('Promise productdetail rejected')
        }
    }
    const fetchVoucher = async () => {
        const token = Cookies.get('token')
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/voucher${token ? '' : '/active'}?productId=${id}`,
                {
                    method: 'GET',
                    ...(token && { credentials: 'include' }),
                },
            )
            const res = await req.json()

            if (res.success) {
                setVouchers(res.voucher)
            }
        } catch (error) {
            console.log('Error fetch voucher', error)
        }
    }
    useEffect(() => {
        fetchProduct()
        fetchVoucher()
        fetchProductDetail()
        window.scrollTo(0, 0)
    }, [id])

    const handleClickColor = (item) => {
        setColor(item)
        setSize()
        setQuantity(1)
    }
    const handleClickSize = (item) => {
        setSize(item)
        setMaxQuantity(productdetail.productdetail.find((p) => p.color == color && p.size == item).quantity)
    }
    const handleIncrease = () => {
        if (!size && productdetail.isSize) toast.warning('Vui lòng chọn size')
        else if (quantity < maxQuantity) setQuantity((prevQuantity) => prevQuantity + 1)
    }
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1)
        }
    }
    const handleChange = (event) => {
        const newQuantity = parseInt(event.target.value)
        setQuantity(newQuantity)
    }
    const handleBlur = () => {
        if (quantity > maxQuantity) {
            setQuantity(maxQuantity)
        }
        if (quantity < 1 || isNaN(quantity)) {
            setQuantity(1)
        }
    }

    const handleAdd = async () => {
        const addProduct = {
            color: color,
            size: size ? size : '',
            quantity: quantity,
            ProductId: id,
        }

        const userDataString = Cookies.get('token')
        if (!userDataString) {
            toast.warning('Vui lòng đăng nhập')
            navigate('/auth/login')
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
            } else toast.warning(res.message)
        } catch (error) {
            console.error('Error adding product:', error.message)
            throw error
        }
    }

    const handleRating = (value) => {
        setRating(value)
    }

    //image
    function ButtonNext(props) {
        const { onClick } = props
        return <HiArrowRight onClick={onClick} className="absolute right-7 top-[55%] text-[30px] text-black " />
    }

    function ButtonPrev(props) {
        const { onClick } = props
        return <HiArrowLeft onClick={onClick} className="absolute right-7 top-[45%] z-10 text-[30px] text-gray-300 " />
    }
    const settings = {
        customPaging: function (i) {
            return (
                <a>
                    <img src={`${JSON.parse(data.image)[i]}`} alt="" />
                </a>
            )
        },
        appendDots: (dots) => (
            <div>
                <ul className="absolute left-[-60px] top-0 flex max-w-[55px] flex-col gap-2"> {dots} </ul>
            </div>
        ),
        dots: true,
        dotsClass: 'slick-thumb',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <ButtonNext />,
        prevArrow: <ButtonPrev />,
    }
    return (
        <>
            {data && (
                <>
                    <div className=" mx-auto max-w-6xl px-4 pt-8">
                        <div className="mx-auto md:max-w-4xl">
                            <div className="pb-7">
                                <Link to={'/home'}>Sản phẩm</Link> / {data.product_name}{' '}
                            </div>
                            <div className="relative mx-auto flex flex-col items-center justify-center pb-20  lg:flex-row lg:items-start">
                                <div className="top-5 w-[45%] lg:sticky">
                                    <Slider {...settings} className="w-full">
                                        {JSON.parse(data.image).map((item) => {
                                            return (
                                                <div key={item} className="w-full">
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={`${item}`}
                                                        alt=""
                                                    />
                                                </div>
                                            )
                                        })}
                                    </Slider>
                                </div>
                                <div className="w-[60%] px-8">
                                    <div className="text-4xl font-bold">{data.product_name}</div>
                                    <div className="my-8 flex items-end gap-2">
                                        {rating && (
                                            <>
                                                {rating.count ? (
                                                    <>
                                                        <StarRating
                                                            className="text-4xl"
                                                            css="text-blue-800 w-7 h-7"
                                                            rating={rating.point}
                                                        />
                                                        <div>({rating.count})</div>
                                                    </>
                                                ) : (
                                                    <div className="mr-5 italic">Chưa có đánh giá</div>
                                                )}
                                            </>
                                        )}
                                        <div>| Đã bán (web): {data.quantitySell}</div>
                                    </div>
                                    {data.discount ? (
                                        <div className="mb-5 flex gap-2 font-bold">
                                            <div className="text-2xl">
                                                {(data.price - data.price * data.discount * 0.01).toFixed()}.000đ
                                            </div>
                                            <div className="text-2xl text-gray-400">
                                                <del>{data.price}.000đ</del>
                                            </div>
                                            <div className="text-xl text-red-600">-{data.discount}%</div>
                                        </div>
                                    ) : (
                                        <div className="mb-5 text-2xl font-bold">{data.price}.000đ</div>
                                    )}
                                    {/* voucher */}
                                    {vouchers && (
                                        <div className="flex">
                                            <div className="text-nowrap py-1 pr-2">Mã giảm giá: </div>
                                            {vouchers?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {vouchers.map((voucher) => (
                                                        <span
                                                            key={voucher.id}
                                                            className={`voucher relative text-nowrap bg-contain bg-repeat-y px-4  py-1 text-orange-700 `}
                                                            style={{ backgroundImage: `url(${imgvoucher})` }}
                                                        >
                                                            Giảm{' '}
                                                            {voucher.discountUnit === 'percent'
                                                                ? `${voucher.discountValue}%`
                                                                : `${voucher.discountValue}K`}
                                                            <div className="detaiVoucher absolute left-0 top-[32px] z-10 hidden rounded-md border bg-white p-2 text-black shadow-sm">
                                                                Nhập mã <b>{voucher.discountCode}</b> <br />
                                                                Giảm ngay{' '}
                                                                <b>
                                                                    {voucher.discountValue}
                                                                    {voucher.discountUnit === 'percent' ? `% ` : `K `}
                                                                </b>
                                                                {voucher.discountType === 'order'
                                                                    ? `khi mua đơn hàng từ ${(voucher.condition * 1000).toLocaleString('vi-VN')}đ.`
                                                                    : `khi mua từ ${voucher.condition} sản phẩm.`}
                                                            </div>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-1 italic">(Không có)</div>
                                            )}
                                        </div>
                                    )}

                                    {/* màu sắc */}
                                    <div>Màu sắc:</div>
                                    {productdetail && (
                                        <>
                                            <div className="mb-6 mt-2 flex flex-wrap gap-2">
                                                {[
                                                    ...new Set(
                                                        productdetail.productdetail.map((product) => product.color),
                                                    ),
                                                ].map((item) => (
                                                    <div
                                                        onClick={() => (color !== item ? handleClickColor(item) : null)}
                                                        key={item}
                                                        className={`${color === item ? '!bg-black text-white ' : 'cursor-pointer '} border-gray min-w-14 rounded-md border border-solid p-1 px-2 text-center text-lg `}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                            {productdetail.isSize && (
                                                <div>
                                                    <div className="flex justify-between">
                                                        <div>Kích thước:</div>
                                                    </div>
                                                    {/* CÁC SIZE */}
                                                    <div className="mr-1 mt-1 flex w-full flex-wrap gap-2">
                                                        {sizeDefault.map((item, index) => {
                                                            const checkSize = productdetail.productdetail
                                                                .filter((i) => i.color === color)
                                                                .map((product) => product.size)
                                                                .includes(item)
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        backgroundColor: '#d9d9d9',
                                                                    }}
                                                                    className={`m-1 w-16 rounded-lg px-2 py-1 text-center text-lg ${checkSize ? (item === size ? '!bg-black text-white' : 'cursor-pointer') : 'opacity-30'} `}
                                                                    onClick={
                                                                        checkSize && item !== size
                                                                            ? () => handleClickSize(item)
                                                                            : null
                                                                    }
                                                                >
                                                                    {item}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="mt-8 flex gap-2 border-b pb-12">
                                        <div className=" flex w-fit items-center rounded-full border border-gray-600 py-2">
                                            <button className="px-2 text-4xl" onClick={handleDecrease}>
                                                <TiMinus className="h-6 w-6" />
                                            </button>
                                            <input
                                                className="w-14 appearance-none text-center text-2xl "
                                                type="number"
                                                value={quantity}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <button className="px-2 text-4xl" onClick={handleIncrease}>
                                                <FaPlus className="h-6 w-6" />
                                            </button>
                                        </div>
                                        {productdetail && (!productdetail.isSize || size) ? (
                                            <button
                                                className="w-full rounded-full bg-black text-center text-white"
                                                onClick={() => handleAdd()}
                                            >
                                                Thêm vào giỏ hàng
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full rounded-full bg-black text-center text-white"
                                                onClick={() => toast.warning('Vui lòng chọn size')}
                                            >
                                                Vui lòng chọn kích thước
                                            </button>
                                        )}
                                    </div>
                                    <div className="my-4 rounded-lg bg-gray-200 p-6">
                                        <div className="mb-2 font-bold">Giao hàng toàn quốc</div>
                                        <div className="flex items-center gap-2">
                                            <BiTimer className="text-2xl text-blue-400" />
                                            Nội thành Hà Nội và HCM nhận hàng trong 1-2 ngày
                                        </div>
                                        <br />
                                        <div className="flex items-center gap-2">
                                            <IoLogoDropbox className="text-2xl text-blue-400" />Ở tỉnh thành khác nhận
                                            hàng từ 2-5 ngày
                                        </div>
                                    </div>
                                    <div className="border-t">
                                        <div className="py-4 font-bold">Đặc điểm nổi bật</div>
                                        <div>
                                            {data.descriptionProducts.split('\u005C\u005C').map((item, index) => (
                                                <div key={index} className="my-2 flex gap-3 italic">
                                                    <b>+</b>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProductRelate id={id} />
                    <ProductReviews id={id} onHandleRating={handleRating} />
                </>
            )}
        </>
    )
}

export default ProductDetail
