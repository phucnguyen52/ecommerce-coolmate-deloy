import { useEffect, useState } from 'react'
import StarRating from './StarRating'
import { format } from 'date-fns'
const ProductReviews = (props) => {
    const [data, setData] = useState()
    const { id, onHandleRating } = props
    const point = data ? (data.totalRecords !== 0 ? (Number(data.totalStars) / data.totalRecords).toFixed(1) : 0) : ''

    const fetchRating = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/rating/${id}`,
                { credentials: 'include' },
            )
            const res = await req.json()
            if (res.succes) {
                const count = res.rating[0].totalRecords
                const total = +res.rating[0].totalStars
                onHandleRating({
                    count: count,
                    point: count !== 0 ? (total / count).toFixed(2) : 0,
                })
                setData(res.rating[0])
            }
        } catch (error) {
            console.log('Error fetch rating', error)
        }
    }
    useEffect(() => {
        fetchRating()
    }, [id])
    return (
        <>
            {data && (
                <div>
                    <div className="flex gap-10 px-4 pb-10">
                        <div className="h-fit basis-1/4 rounded-3xl bg-[#f1f1f1] p-8 text-center">
                            <div className="text-2xl font-semibold">ĐÁNH GIÁ SẢN PHẨM</div>
                            {data.totalRecords > 0 && (
                                <>
                                    <div className="my-4 text-5xl font-extrabold">{point}</div>
                                    <div className="my-2 flex justify-around">
                                        <StarRating
                                            className="text-4xl"
                                            css="text-yellow-400 w-10 h-10"
                                            rating={point}
                                        />
                                    </div>
                                </>
                            )}
                            {data.totalRecords === 0 ? (
                                <div className="mt-1 italic">(Hiện tại chưa có đánh giá cho sản phẩm này)</div>
                            ) : (
                                <div className="mt-3 italic">
                                    Dựa trên {data.totalRecords} đánh giá đến từ khách hàng
                                </div>
                            )}
                        </div>
                        <div className="basis-3/4 py-1">
                            {data.reviews && (
                                <div className="gap-y2 grid grid-cols-2">
                                    {data.reviews.map((item, index) => (
                                        <div key={index} className="border-b py-4 pl-2 pr-4 text-sm">
                                            <div className="mb-4 flex items-center justify-between pr-20">
                                                <div className="flex gap-3">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={item.userImage}
                                                        alt=""
                                                    />
                                                    <div className="my-2 font-bold">{item.userName}</div>
                                                </div>
                                                <StarRating
                                                    className="text-lg"
                                                    css="text-blue-700 w-4 h-4"
                                                    rating={item.reviewStars}
                                                />
                                            </div>

                                            <div className="my-3 text-xs italic text-gray-400">
                                                {/* {item.color} {item.size.trim()? `/ ${item.size}`: null} */}
                                            </div>
                                            <div className="mb-2 mt-4">{item.reviewComment}</div>
                                            <img
                                                src={item.reviewImage}
                                                alt=""
                                                className="mb-2 h-32 w-32 object-contain"
                                            />
                                            <div className="text-xs italic text-gray-400">
                                                Thời gian: {format(new Date(item.reviewDate), 'dd/MM/yyyy')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default ProductReviews
