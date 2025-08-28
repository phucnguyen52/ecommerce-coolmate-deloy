import { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosLogOut, IoIosLogIn, IoIosListBox } from 'react-icons/io'
import { FaUser } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import Cookies from 'js-cookie'
import { APP_ROUTER } from '../../utils/Constants'
import { StoreContext } from '../../layout/Main/MainLayout'
import { toast } from 'react-toastify'
import LOGO from '../../assets/img/LOGO.png'
function Header() {
    const data = useContext(StoreContext)
    const userDataString = Cookies.get('token')
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value)
    }

    const handleClickSearch = () => {
        const searchValue = inputRef.current.value.trim()
        if (searchValue !== '') {
            navigate(`/search/${searchValue}`)
            setSearchValue('')
        } else {
            toast.warning('Vui lòng nhập đúng giá trị tìm kiếm')
        }
    }
    const isSearchPage = window.location.pathname.startsWith('/search')
    return (
        <header>
            <div className="sticky top-0 z-50 w-full bg-white text-black shadow-lg">
                <div className="flex items-center justify-around ">
                    <div className="ml-10">
                        <Link to={APP_ROUTER.HOME}>
                            <img src={LOGO} alt="Coolmate" className="h-24 w-24" />
                        </Link>
                    </div>
                    <div className="flex grow justify-center gap-x-10 text-xl font-semibold">
                        <Link to={APP_ROUTER.HOME} className="cursor-pointer p-6 hover:font-semibold hover:underline">
                            TRANG CHỦ
                        </Link>
                        <Link
                            to={APP_ROUTER.PRODUCT}
                            className="cursor-pointer p-6 hover:font-semibold hover:underline"
                        >
                            SẢN PHẨM
                        </Link>
                        <Link to={APP_ROUTER.SALE} className="cursor-pointer p-6 hover:font-semibold hover:underline">
                            GIẢM GIÁ
                        </Link>
                    </div>
                    {!isSearchPage && (
                        <div
                            className="relative flex rounded-md border bg-white text-base"
                            data-twe-input-wrapper-init
                            data-twe-input-group-ref
                        >
                            <input
                                type="search"
                                className="peer-focus:text-primary dark:autofill:shadow-autofill dark:peer-focus:text-primary peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] text-slate-800 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                placeholder="Search"
                                aria-label="Search"
                                ref={inputRef}
                                value={searchValue}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleClickSearch()
                                    }
                                }}
                                onChange={handleSearchChange}
                                id="search-input"
                                aria-describedby="search-button"
                                autoComplete="off"
                            />
                            <label
                                htmlFor="search-input"
                                className="peer-focus:text-primary dark:peer-focus:text-primary pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-slate-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.5rem] peer-focus:scale-[0.8] peer-focus:text-white peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400"
                            >
                                Tìm kiếm sản phẩm
                            </label>
                            <button
                                className="shadow-primary-3 hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 active:bg-primary-600 active:shadow-primary-2  relative z-[2] -ms-0.5 flex items-center rounded-e  px-5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 "
                                type="button"
                                id="search-button"
                                data-twe-ripple-init
                                data-twe-ripple-color="light"
                                onClick={handleClickSearch}
                            >
                                <span className="[&>svg]:h-5 [&>svg]:w-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="black"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}

                    <div className="mx-10 flex grow-0 gap-5">
                        {userDataString && (
                            <div className={userDataString ? '' : 'hidden'}>
                                <Link to="/user">
                                    <FaUser className="h-7 w-7" />
                                </Link>
                            </div>
                        )}
                        <div className={userDataString ? 'hidden' : ''}>
                            <Link to="/auth/login">
                                <IoIosLogIn className="h-7 w-7" />
                            </Link>
                        </div>
                        <div className={userDataString ? '' : 'hidden'}>
                            <div className="relative">
                                <Link
                                    to={{
                                        pathname: '/shopping-cart',
                                    }}
                                >
                                    <FaCartShopping className="h-7 w-7" />
                                </Link>
                                <div className="absolute right-[-5px] top-[-6px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-red-600 text-center text-[12px] font-bold text-white">
                                    {data.count}
                                </div>
                            </div>
                        </div>
                        <div className={userDataString ? '' : 'hidden'}>
                            <Link to="/order">
                                <IoIosListBox className="h-7 w-7" />
                            </Link>
                        </div>
                        <div className={userDataString ? '' : 'hidden'}>
                            <Link to="/auth/logout">
                                <IoIosLogOut className="h-7 w-7" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
