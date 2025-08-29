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
        <div className="mx-28 mb-20">
            <div className="mb-10 text-center text-3xl font-bold">CÁC SẢN PHẨM LIÊN QUAN</div>
            {data && (
                <div className={`flex flex-row flex-nowrap gap-5 `}>
                    {data.map((item) => {
                        return (
                            <div key={item.id} className="basis-1/5">
                                <ProductCard value={item} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ProductRelate
