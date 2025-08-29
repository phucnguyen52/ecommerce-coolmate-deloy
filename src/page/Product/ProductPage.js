import { useEffect, useState } from 'react'
import { Slider } from 'antd'
import ProductCard from '../../components/product/productCard'
import './index.css'
import PageNumber from '../../components/pageNumber'

const ProductPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [listData, setListData] = useState()
    const [data, setData] = useState()
    const [page, setPage] = useState(1)
    const [category, setCategory] = useState()

    const [filter, setFilter] = useState({
        category: [],
        min: 0,
        max: 1000,
        size: [],
        sort: 'new',
        type: 'DESC',
    })
    const sizeList = ['S', 'M', 'L', 'XL', '2XL', '3XL']

    const fetchCategory = async () => {
        try {
            const req = await fetch(`https://ecommerce-coolmate-server-production.up.railway.app/api/admin/category`)
            const res = await req.json()
            if (res.succes) {
                setCategory(res.category)
            }
        } catch (error) {
            console.log('Error fetch category', error)
        }
    }

    const fetchProduct = async () => {
        try {
            // https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product?category=1, 2&sort=sale&type=ASC&min=0&max=10000
            const req = await fetch(
                `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product?` +
                    `${filter.min ? `&min=${filter.min}` : '&min=0'}` +
                    `${filter.max ? `&max=${filter.max}` : '&max=1000000'}` +
                    `${filter.size.length > 0 ? `&size=${filter.size.map((size) => `'${size}'`).join(',')}` : ''}` +
                    `${filter.category.length > 0 ? `&category=${filter.category.join(',')}` : ''}` +
                    `${filter.type ? `&type=${filter.type}` : ''}` +
                    `${filter.sort ? `&sort=${filter.sort}` : ''}`,
            )
            const res = await req.json()
            if (res.succes) {
                setListData(res.product)
                setData(res.product.slice(0, 10))
                if (res.product > 0) setPage(1)
                setIsLoading(false)
            }
        } catch (error) {
            console.log('Error fetch product', error)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])
    useEffect(() => {
        fetchProduct()
    }, [filter])
    useEffect(() => {
        if (listData?.length > 0) setData(listData.slice((page - 1) * 10, page * 10))
    }, [page])

    const handleDeleteFilter = () => {
        const checkboxs = document.querySelectorAll('input[type="checkbox"]')
        checkboxs.forEach((item) => (item.checked = false))
        const selectElement = document.querySelector('select[name="sort"]')
        if (selectElement) {
            selectElement.selectedIndex = 0
        }
        setFilter({
            ...filter,
            category: [],
            size: [],
            min: 0,
            max: 1000,
        })
    }

    const handleSort = (e) => {
        const sort = e.target.value.split(' ')
        setFilter({
            ...filter,
            sort: sort[0],
            type: sort[1],
        })
    }
    //price
    const onChangePrice = (value) => {
        setFilter((prev) => ({
            ...prev,
            min: value[0],
            max: value[1],
        }))
    }

    const handleFilter = (e, type) => {
        if (e.target.checked) {
            setFilter((prev) => ({
                ...prev,
                [type]: [...prev[type], e.target.value],
            }))
        } else {
            setFilter((prev) => ({
                ...prev,
                [type]: prev[type].filter((i) => i !== e.target.value),
            }))
        }
    }

    return (
        <>
            <div>
                <div className="mx-6 mt-10">
                    <div className="mx-4 flex">
                        <div className="basis-1/4 border-r pr-14">
                            {/* <form action="" onSubmit={submitFilter}> */}
                            <button
                                className="float-right mx-3 italic text-blue-600 underline"
                                onClick={() => handleDeleteFilter()}
                            >
                                Xoá lọc
                            </button>
                            <div>
                                <div className="mb-4 font-semibold text-gray-500">Danh mục</div>
                                {category && (
                                    <div>
                                        {category.map((item, index) => (
                                            <label
                                                key={index}
                                                className={`relative my-2 block w-fit cursor-pointer pl-9`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="category"
                                                    value={item.id}
                                                    className="hidden"
                                                    onChange={(e) => handleFilter(e, 'category')}
                                                />
                                                {item.categoryName}
                                                <span className="check absolute left-0 top-0 h-5 w-5 rounded-sm border"></span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="my-8 border-t pt-4">
                                <div className="mb-6 mt-4 font-semibold text-gray-500">Giá: </div>
                                <Slider
                                    range
                                    max={1000}
                                    step={50}
                                    marks={{
                                        0: '0',
                                        1000: '1.000.000VNĐ',
                                    }}
                                    defaultValue={[filter.min, filter.max]}
                                    onChangeComplete={onChangePrice}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sizeList.map((item, index) => (
                                    <label key={index} className={`cursor-pointer`}>
                                        <input
                                            type="checkbox"
                                            name="size"
                                            value={item}
                                            className="hidden"
                                            onChange={(e) => handleFilter(e, 'size')}
                                        />
                                        <div className="w-16 rounded-lg border p-1 text-center">{item}</div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="ml-4 basis-3/4">
                            <div className="mb-4 flex items-center">
                                <div className="grow px-3">{listData?.length || 0} kết quả</div>
                                <div className="flex items-center gap-4">
                                    <div className="font-medium text-gray-400">PHÂN LOẠI</div>
                                    <select
                                        className="float-right rounded-md border-2 px-2 py-1"
                                        name="sort"
                                        onChange={handleSort}
                                    >
                                        <option value="new DESC" test="test1">
                                            Mới nhất
                                        </option>
                                        <option value="sale DESC">Bán chạy</option>
                                        <option value="price ASC">Giá thấp đến cao</option>
                                        <option value="price DESC">Giá cao đến thấp</option>
                                    </select>
                                </div>
                            </div>
                            {data && (
                                <>
                                    <div className="grid grid-cols-3 gap-4">
                                        {data.map((item, index) => (
                                            <ProductCard key={index} value={item} className="w-full" />
                                        ))}
                                    </div>
                                    {listData?.length > 0 && (
                                        <PageNumber
                                            num={Math.ceil(listData.length / 10)}
                                            setPage={setPage}
                                            setData={setData}
                                            page={page}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductPage
