import { Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import ProductCard from './productCard'
import { useNavigate } from 'react-router-dom'

const ProductRelate = (props) => {
    const navigate = useNavigate()
    const { id } = props
    const [data, setData] = useState()

    const fetchAPI = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${id}/relate`,
            )
            const res = await req.json()
            if (res.succes) {
                setData(res.product.slice(0, 5))
            } else {
                console.error('ProductRelate failed')
            }
        } catch {
            navigate('/error')
        }
    }
    useEffect(() => {
        fetchAPI()
    }, [])

    return (
        <div className="container mx-auto mb-7 px-4 md:mb-10">
            <div className="mb-5 text-center text-2xl font-bold md:mb-10 md:text-3xl">CÁC SẢN PHẨM LIÊN QUAN</div>

            {data && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {data.map((item) => (
                        <div key={item.id}>
                            <ProductCard value={item} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductRelate
