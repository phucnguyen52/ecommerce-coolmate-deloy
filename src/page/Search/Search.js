import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../../components/product/productCard'
import { TbMoodEmpty } from 'react-icons/tb'
const Search = () => {
    const { searchValue } = useParams()
    const [search, setSearch] = useState(searchValue)
    const [searchResults, setSearchResults] = useState([])
    const [emptyProduct, setEmptyProduct] = useState(false)
    const fetchProduct = async () => {
        setEmptyProduct(false)
        if (search.trim() !== '') {
            try {
                const response = await axios.get(
                    `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/search?search=${search}`,
                )
                if (response.data.succes) {
                    setSearchResults(response.data.product)
                    if (response.data.product.length === 0) {
                        setEmptyProduct(true)
                    }
                }
            } catch (error) {
                console.error('Error fetching search results:', error)
            }
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])
    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    return (
        <>
            <div>
                <div className="mx-auto mt-10 max-w-md">
                    <label
                        htmlFor="default-search"
                        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Tìm kiếm sản phẩm
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg
                                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Tìm kiếm sản phẩm..."
                            required
                            value={search}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    fetchProduct()
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={fetchProduct}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                {emptyProduct && (
                    <>
                        <div className="mt-5 flex items-center justify-center gap-3">
                            <div className="text-center italic text-gray-500">
                                Không có sản phẩm phù hợp với tìm kiếm của bạn
                            </div>
                            <TbMoodEmpty className="h-7 w-7" />
                        </div>
                    </>
                )}
                <div>
                    <div className="m-20 grid grid-cols-5 gap-5">
                        {searchResults.map((item) => (
                            <ProductCard value={item} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search
