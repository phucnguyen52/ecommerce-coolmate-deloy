import Banner from './Banner'
import ListProducts from './ListProducts'
import { imgCategory } from '../../assets'
import { Link } from 'react-router-dom'
const HomePage = () => {
    const Category = [imgCategory.TatCaSP, imgCategory.DoTheThao, imgCategory.MacHangNgay, imgCategory.DoLot]

    return (
        <>
            <Banner className="h-[300px]" />
            <ListProducts />
            {/* {data && (
                <OutstandingProducts
                    title="ĐỒ CHẠY BỘ"
                    description="Trải nghiệm chưa từng có trong mỗi sải chân"
                    poster={images.DoChayBo}
                    data={data.running}
                />
            )} */}
            {/* {data && (
                <OutstandingProducts
                    title="QUẦN DÀI NAM"
                    description="Tạo nên những bộ outfit cực cool cho chàng"
                    poster={images.DoChayBo}
                    data={data.running}
                />
            )} */}
            {Category && (
                <div className="mx-4 mb-10 flex gap-4">
                    {Category.map((item) => (
                        <Link className="relative" key={item}>
                            <img className="h-full w-full rounded-sm object-cover" src={item} alt="" />
                            <div className="absolute top-0 h-full w-full rounded-sm hover:bg-black hover:opacity-20"></div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}

export default HomePage
