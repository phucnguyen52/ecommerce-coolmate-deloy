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
                <div className="mb-10 px-4 md:px-10">
                    <div className="mb-3 text-center text-2xl font-bold md:mb-8 md:text-3xl">ĐÁNH GIÁ SẢN PHẨM</div>

                    <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                        {/* Tổng quan rating */}
                        <div className="flex flex-row items-center   gap-2 rounded-3xl bg-[#f1f1f1] p-3 md:basis-1/4 md:flex-col md:gap-0 md:p-6">
                            {data.totalRecords > 0 ? (
                                <>
                                    <div className="mb-0 mt-0 text-xl font-extrabold md:mb-1 md:mt-2 md:text-5xl">
                                        {point}
                                    </div>
                                    <StarRating
                                        className="my-0 md:my-2"
                                        css="text-yellow-400 w-5 h-5 md:w-10 md:h-10 "
                                        rating={point}
                                    />
                                    <div className="mt-2 hidden text-sm italic text-gray-600 md:block">
                                        Dựa trên {data.totalRecords} đánh giá từ khách hàng
                                    </div>
                                    <div className=" flex text-sm italic text-gray-600 md:hidden">
                                        ({data.totalRecords} đánh giá)
                                    </div>
                                </>
                            ) : (
                                <div className="italic text-gray-500">(Hiện tại chưa có đánh giá cho sản phẩm này)</div>
                            )}
                        </div>

                        {/* Danh sách review */}
                        <div className="md:basis-3/4">
                            {data.reviews && data.reviews.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {data.reviews.map((item, index) => (
                                        <div key={index} className="rounded-xl border p-4 text-sm shadow-sm">
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={item.userImage}
                                                        alt=""
                                                    />
                                                    <div className="font-bold">{item.userName}</div>
                                                </div>
                                                <StarRating
                                                    className="text-lg"
                                                    css="text-blue-700 w-4 h-4"
                                                    rating={item.reviewStars}
                                                />
                                            </div>

                                            <div className="mb-2 text-xs italic text-gray-500">
                                                {item.color}
                                                {item.size?.trim() ? ` / ${item.size}` : ''}
                                            </div>

                                            <div className="mb-3">{item.reviewComment}</div>

                                            {item.reviewImage && (
                                                <div className="mb-2 flex gap-2 overflow-x-auto">
                                                    {item.reviewImage.split(',').map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img}
                                                            alt=""
                                                            className="h-24 w-24 flex-shrink-0 rounded-md object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-xs italic text-gray-400">
                                                Thời gian: {format(new Date(item.reviewDate), 'dd/MM/yyyy')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center italic text-gray-500">Không có đánh giá nào</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductReviews
