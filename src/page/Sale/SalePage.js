import { useEffect, useState } from 'react'
import Voucher from '../../components/voucher/voucher'
import ProductCard from '../../components/product/productCard'
import PageNumber from '../../components/pageNumber'
import Cookies from 'js-cookie'

const SalePage = () => {
    const [vouchers, setVouchers] = useState()
    const [categorys, setCategorys] = useState()
    const [products, setProducts] = useState()
    const [listProduct, setListProduct] = useState()
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({
        category: '',
        type: 'DESC',
    })

    const fetchVoucher = async () => {
        const token = localStorage.getItem('token')

        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/voucher${token ? '' : '/active'}`,
                {
                    method: 'GET',
                    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
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
    const fetchCategory = async () => {
        try {
            const req = await fetch(`https://ecommerce-coolmate-server-production.up.railway.app/api/admin/category`)
            const res = await req.json()
            if (res.succes) {
                setCategorys([{ id: 0, categoryName: 'Tất cả' }, ...res.category])
            }
        } catch (error) {
            console.log('Error fetch category', error)
        }
    }
    const fetchProduct = async () => {
        try {
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product?sort=sale&type=${filter.type}&min=0&max=10000000&percent=30` +
                    (filter.category ? `&category=${filter.category}` : ''),
            )
            const res = await req.json()

            if (res.succes) {
                setListProduct(res.product)
                setProducts(res.product.slice(0, 10))
            }
        } catch (error) {
            console.log('Error fetch product', error)
        }
    }
    useEffect(() => {
        fetchVoucher()
        fetchCategory()
    }, [])
    useEffect(() => {
        if (listProduct?.length > 0) setProducts(listProduct.slice(page * 10, (page + 1) * 10))
    }, [filter])
    useEffect(() => {
        fetchProduct()
    }, [filter])

    const handleSelectCategory = (value) => {
        if (value !== filter.category) setFilter((prev) => ({ ...prev, category: value }))
    }

    return (
        <div>
            <div className="m-4 md:m-8 lg:m-14">
                <div className="mb-4 text-lg font-bold md:text-xl">TẤT CẢ MÃ GIẢM GIÁ</div>
                <div
                    className="grid max-h-[40vh] w-full 
                grid-cols-1 place-items-center gap-3 overflow-y-auto 
                sm:grid-cols-2 sm:place-items-stretch 
                md:grid-cols-3 
                md:gap-4 lg:grid-cols-4
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 
                [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                [&::-webkit-scrollbar]:w-2"
                >
                    {vouchers && vouchers.map((voucher) => <Voucher voucher={voucher} key={voucher.id} />)}
                </div>
            </div>

            <div className="m-4 md:m-8 lg:m-14">
                <div className="mb-4 text-lg font-bold md:text-xl">SALE UP TO 50%</div>

                {categorys && (
                    <div className="mb-6 flex flex-wrap gap-2 md:mb-10">
                        {categorys.map((item) => (
                            <div
                                key={item.id}
                                className={`${
                                    item.id === filter.category
                                        ? 'bg-black text-white'
                                        : 'cursor-pointer hover:font-semibold hover:underline'
                                } rounded-lg border px-3 py-2 text-sm md:px-4 md:text-base`}
                                onClick={() => handleSelectCategory(item.id)}
                            >
                                {item.categoryName}
                            </div>
                        ))}
                    </div>
                )}

                {products?.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
                            {products.map((item, index) => (
                                <ProductCard key={index} value={item} className="w-full" />
                            ))}
                        </div>
                        <PageNumber num={Math.ceil(listProduct?.length / 10)} setPage={setPage} page={page} />
                    </>
                ) : (
                    <div className="py-20 text-center text-sm md:py-40 md:text-base">Không có sản phẩm phù hợp</div>
                )}
            </div>
        </div>
    )
}

export default SalePage
