import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState } from 'react'
import ProductCard from '../../components/product/productCard'
import { HiArrowRight } from 'react-icons/hi'
import { HiArrowLeft } from 'react-icons/hi'
import { useEffect } from 'react'

const ListProducts = () => {
    const [data, setData] = useState()
    const [option, setOption] = useState('price')
    const [current, setCurrent] = useState(0)
    const [slide, setSlide] = useState(5)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640)
                setSlide(2) // mobile
            else if (window.innerWidth < 768)
                setSlide(3) // tablet nhỏ
            else if (window.innerWidth < 1024)
                setSlide(3) // tablet lớn / laptop nhỏ
            else if (window.innerWidth < 1280)
                setSlide(4) // laptop
            else setSlide(5) // desktop lớn
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleClick = (value) => {
        if (option !== value) {
            setOption(value)
            setCurrent(0)
        }
    }
    const fetData = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product?sort=${option}&type=ASC&min=0&max=10000`,
            )
            const res = await req.json()
            if (res.succes) {
                setData(res.product)
            }
        } catch (error) {
            console.log('Error home product new sale', error)
        }
    }
    useEffect(() => {
        fetData()
    }, [option])
    // Update currentTime mỗi 1 giây
    useEffect(() => {
        if (data?.length) {
            const timer = setInterval(() => {
                if (current >= data.length - slide) setCurrent(0)
                else setCurrent(current + slide)
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [current, data, slide])

    let previousSlide = () => {
        if (current === 0) setCurrent(data.length - slide + 1)
        else setCurrent(current - 1)
    }
    let nextSlide = () => {
        if (current >= data.length - slide + 1) setCurrent(0)
        else setCurrent(current + 1)
    }

    return (
        <>
            <div className="mt-0 sm:mt-8 lg:mb-20">
                <div className="mb-5 ml-4 mt-8 flex gap-4 sm:gap-6 md:mt-0">
                    <button
                        className={`${
                            option === 'new' ? 'bg-black text-white' : 'border border-black bg-white text-black'
                        } rounded-3xl px-4 py-2 text-sm font-bold sm:px-6 sm:text-lg`}
                        onClick={() => handleClick('new')}
                    >
                        Sản phẩm mới
                    </button>
                    <button
                        className={`${
                            option === 'price' ? 'bg-black text-white' : 'border border-black bg-white text-black'
                        } rounded-3xl px-4 py-2 text-sm font-bold sm:px-6 sm:text-lg`}
                        onClick={() => handleClick('price')}
                    >
                        Bán chạy nhất
                    </button>
                </div>
                <div className="relative ml-4 mt-10 overflow-hidden lg:mt-4">
                    <div
                        className={`duration-40 h-500px flex transition ease-out`}
                        style={{
                            transform: `translateX(-${current * (100 / slide)}%)`,
                            transition: `2s`,
                        }}
                    >
                        {data &&
                            data.map((product) => (
                                <div key={product.id} className="pr-3" style={{ minWidth: `${100 / slide}%` }}>
                                    <ProductCard value={product} />
                                </div>
                            ))}
                    </div>
                    <div
                        onClick={previousSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/15 p-2 text-lg sm:p-3 sm:text-2xl"
                    >
                        <HiArrowLeft />
                    </div>
                    <div
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/15 p-2 text-lg sm:p-3 sm:text-2xl"
                    >
                        <HiArrowRight />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListProducts
