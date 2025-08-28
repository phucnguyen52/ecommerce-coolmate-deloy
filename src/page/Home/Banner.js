import images from '../../assets'
import { HiArrowRight } from 'react-icons/hi'
import { HiArrowLeft } from 'react-icons/hi'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

function Banner() {
    const imgs = [images.banner1, images.banner2, images.banner3, images.banner4]
    function ButtonNext(props) {
        const { onClick } = props
        return <HiArrowRight onClick={onClick} className="absolute right-7 top-[55%] text-[30px] text-gray-500 " />
    }

    function ButtonPrev(props) {
        const { onClick } = props
        return <HiArrowLeft onClick={onClick} className="absolute right-7 top-[45%] z-10 text-[30px] text-white " />
    }
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        nextArrow: <ButtonNext />,
        prevArrow: <ButtonPrev />,
    }

    return (
        <div>
            <Slider className="mb-10" {...settings}>
                {imgs.map((item, index) => (
                    <div className="h-[700px]" key={index}>
                        <img className="h-full w-full object-cover" src={item} alt="" />
                    </div>
                ))}
            </Slider>
        </div>
    )
}
export default Banner
