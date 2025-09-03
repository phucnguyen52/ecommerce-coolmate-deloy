import { useState } from 'react'

const Voucher = (props) => {
    const { voucher } = props
    const [showModal, setShowModal] = useState(false)
    return (
        <div
            className="flex h-[90px] w-[250px] min-w-[200px] overflow-hidden rounded-xl bg-neutral-100 text-xs shadow-inner 
                        sm:h-[100px] sm:w-[280px] sm:min-w-[220px] 
                        md:h-[100px] md:w-[300px] md:min-w-[250px]"
        >
            {/* Thanh cắt biên bên trái */}
            <div className="relative h-full min-w-[35px] border-r-4 border-dashed border-zinc-300 sm:min-w-[40px]">
                <div className="absolute right-[-14px] top-[-15px] h-6 w-6 rounded-full bg-white"></div>
                <div className="absolute bottom-[-15px] right-[-14px] h-6 w-6 rounded-full bg-white"></div>
            </div>

            {/* Nội dung voucher */}
            <div className="relative flex grow flex-col justify-between p-2 pl-4 sm:pl-5">
                <div>
                    <div className="text-sm font-bold text-neutral-600 sm:text-base">{voucher.discountCode}</div>
                    <div className="max-w-full text-[11px] italic sm:text-xs">
                        Giảm ngay{' '}
                        {voucher.discountUnit === 'percent'
                            ? `${voucher.discountValue}% `
                            : `${(voucher.discountValue * 1000).toLocaleString('vi-VN')}đ `}
                        {voucher.discountType === 'order'
                            ? `khi mua đơn hàng từ ${(voucher.condition * 1000).toLocaleString('vi-VN')}đ.`
                            : `khi mua từ ${voucher.condition} sản phẩm.`}
                    </div>
                </div>
                <div className="text-[11px] sm:text-xs">
                    HSD: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                    <span
                        className="float-right mr-2 cursor-pointer font-semibold italic text-blue-700 sm:mr-4"
                        onClick={() => setShowModal(true)}
                    >
                        Chi tiết
                    </span>
                </div>
            </div>

            {/* Modal chi tiết */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="w-[90%] max-w-[400px] rounded-xl bg-white p-4 shadow-lg sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-base font-bold text-neutral-700 sm:text-lg">
                            Chương trình khuyến mãi: {voucher.nameVoucher}
                        </h2>
                        <div className="space-y-2 text-xs text-neutral-600 sm:text-sm">
                            <p>
                                <strong>Mã:</strong> {voucher.discountCode}
                            </p>
                            <p>
                                <strong>Giảm giá:</strong>{' '}
                                {voucher.discountUnit === 'percent'
                                    ? `${voucher.discountValue}%`
                                    : `${(voucher.discountValue * 1000).toLocaleString('vi-VN')}đ`}
                            </p>
                            <p>
                                <strong>Điều kiện: </strong>
                                {voucher.discountType === 'order'
                                    ? `Đơn hàng từ ${(voucher.condition * 1000).toLocaleString('vi-VN')}đ`
                                    : `Mua từ ${voucher.condition} sản phẩm`}
                            </p>
                            <p>
                                <strong>Giảm tối đa:</strong> {(voucher.maximumPrice * 1000).toLocaleString('vi-VN')}đ/1
                                sản phẩm
                            </p>
                            <p>
                                <strong>Số lượng ưu đãi còn lại:</strong> {voucher.quantityDiscount}
                            </p>
                            <p>
                                <strong>Hiệu lực:</strong> {new Date(voucher.startDate).toLocaleDateString('vi-VN')} -{' '}
                                {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                            </p>
                            <p>
                                <strong>Danh mục áp dụng:</strong>
                            </p>
                            <div className="ml-4">
                                {voucher.Categories && voucher.Categories.length > 0 ? (
                                    voucher.Categories.map((cat) => <div key={cat.id}>- {cat.categoryName}</div>)
                                ) : (
                                    <div>Tất cả sản phẩm</div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Voucher
