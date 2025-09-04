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
import { FaList } from 'react-icons/fa6'
import { HiOutlineHome } from 'react-icons/hi2'
import { IoPricetagsOutline } from 'react-icons/io5'
import { BiCategory } from 'react-icons/bi'
import { LuClipboardList } from 'react-icons/lu'
import { FaRegUser } from 'react-icons/fa'
function Header() {
    const data = useContext(StoreContext)
    const userDataString = localStorage.getItem('token')
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate()

    const inputRef = useRef(null)
    const [openMenu, setOpenMenu] = useState(false)
    const [closing, setClosing] = useState(false)

    const handleClose = () => {
        setClosing(true)
        setTimeout(() => {
            setOpenMenu(false)
            setClosing(false)
        }, 300) // đúng bằng thời gian animation
    }
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
            <div className="z-50 flex w-full items-center justify-between px-4 py-2 text-black shadow-lg lg:px-10">
                <div className="">
                    <Link to={APP_ROUTER.HOME}>
                        <img src={LOGO} alt="Coolmate" className="h-14 w-14 lg:h-20 lg:w-20" />
                    </Link>
                </div>
                <div className="hidden grow justify-center gap-x-10 text-xl font-semibold lg:flex">
                    <Link to={APP_ROUTER.HOME} className="cursor-pointer px-6 hover:font-semibold hover:underline">
                        TRANG CHỦ
                    </Link>
                    <Link to={APP_ROUTER.PRODUCT} className="cursor-pointer px-6 hover:font-semibold hover:underline">
                        SẢN PHẨM
                    </Link>
                    <Link to={APP_ROUTER.SALE} className="cursor-pointer px-6 hover:font-semibold hover:underline">
                        GIẢM GIÁ
                    </Link>
                </div>
                {!isSearchPage && (
                    <div
                        className="relative hidden w-48 rounded-md border bg-white md:flex lg:w-80"
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
                            className="peer-focus:text-primary dark:peer-focus:text-primary pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] text-sm leading-[1.6] text-slate-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.5rem] peer-focus:scale-[0.8] peer-focus:text-white peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none lg:text-base dark:text-neutral-400"
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

                <div className="flex items-center gap-4 lg:ml-10 lg:gap-8">
                    {userDataString ? (
                        <Link to="/user" className="hidden md:block">
                            <FaUser className="h-7 w-7" />
                        </Link>
                    ) : (
                        <Link to="/auth/login" className="hidden md:block">
                            <IoIosLogIn className="h-7 w-7" />
                        </Link>
                    )}

                    {/* Cart */}
                    {userDataString && (
                        <div className="relative">
                            <Link to="/shopping-cart">
                                <FaCartShopping className="h-7 w-7" />
                            </Link>
                            <div className="absolute right-[-5px] top-[-6px] flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                {data.count}
                            </div>
                        </div>
                    )}

                    {/* Order + Logout */}
                    {userDataString && (
                        <>
                            <Link to="/order" className="hidden md:block">
                                <IoIosListBox className="h-7 w-7" />
                            </Link>
                            <Link to="/auth/logout" className="hidden md:block">
                                <IoIosLogOut className="h-7 w-7" />
                            </Link>
                        </>
                    )}
                    <button
                        className="flex items-center justify-center rounded-md md:hidden"
                        onClick={() => setOpenMenu(true)}
                    >
                        <FaList className="h-6 w-6" />
                    </button>
                </div>
            </div>
            {openMenu && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
                        openMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    onClick={handleClose}
                >
                    <div
                        className={`
      fixed left-0 top-0 z-50 h-full w-64 transform bg-white p-6 shadow-lg transition-transform duration-300
       ${openMenu && !closing ? 'animate-slideUp' : 'animate-slideDown'}
    `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="mb-6 w-full text-right" onClick={handleClose}>
                            ✕
                        </button>
                        <nav className="flex flex-col gap-4 text-lg font-medium">
                            <Link to={APP_ROUTER.HOME} onClick={handleClose} className="flex items-center gap-3">
                                <HiOutlineHome />
                                Trang chủ
                            </Link>
                            <Link to={APP_ROUTER.PRODUCT} onClick={handleClose} className="flex items-center gap-3">
                                <BiCategory />
                                Sản phẩm
                            </Link>
                            <Link to={APP_ROUTER.SALE} onClick={handleClose} className="flex items-center gap-3">
                                <IoPricetagsOutline />
                                Giảm giá
                            </Link>

                            {userDataString ? (
                                <div className="flex flex-col gap-4">
                                    <Link
                                        to={APP_ROUTER.USER}
                                        className="flex items-center gap-3"
                                        onClick={handleClose}
                                    >
                                        <FaRegUser /> Thông tin người dùng
                                    </Link>
                                    <Link to="/order" className="flex items-center gap-3" onClick={handleClose}>
                                        <LuClipboardList />
                                        Đơn hàng
                                    </Link>
                                    <Link to="/auth/logout" className="flex items-center gap-3" onClick={handleClose}>
                                        <IoIosLogOut />
                                        Đăng xuất
                                    </Link>
                                </div>
                            ) : (
                                <Link to="/auth/login" className="flex items-center gap-3">
                                    <IoIosLogIn />
                                    Đăng nhập
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
