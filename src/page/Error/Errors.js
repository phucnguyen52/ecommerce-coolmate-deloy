import React from 'react'
import { TbError404 } from 'react-icons/tb'
import { Link } from 'react-router-dom'
const Errors = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center p-40">
                <TbError404 className="h-48 w-60" />
                <div className="text-2xl italic">Chúng tôi thực sự xin lỗi, không tìm thấy trang của bạn yêu cầu!</div>
                <Link
                    to="/home"
                    className="mb-2 me-2 mt-10 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
                >
                    Trang chủ
                </Link>
            </div>
        </>
    )
}

export default Errors
