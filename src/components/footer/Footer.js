import ISO from '../../assets/img/ISO.png'
import BCT from '../../assets/img/BCT.png'
import NCSC from '../../assets/img/NCSC.avif'
import DMCA from '../../assets/img/DMCA.avif'
import FB from '../../assets/img/FB.svg'
import ZALO from '../../assets/img/ZALO.svg'
import TT from '../../assets/img/TT.svg'
import IG from '../../assets/img/IG.svg'
import YT from '../../assets/img/YT.svg'

function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="my-0 ml-auto mr-auto w-[calc(100%-40px)] bg-black py-6 text-white md:w-[calc(100%-120px)]">
                {/* PHẦN TRÊN */}
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    {/* CỘT 1 */}
                    <div className="md:w-1/3">
                        <span className="text-xl font-bold md:text-2xl">COOLMATE lắng nghe bạn!</span>
                        <br />
                        <span className="text-sm md:text-base">
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể
                            nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </span>
                        <br />
                        <div className="my-5 w-full cursor-pointer rounded-[16px] bg-blue-600 py-2.5 text-center text-sm font-medium hover:bg-white hover:text-black md:w-44 md:text-base">
                            Đóng góp ý kiến
                        </div>
                    </div>

                    {/* CỘT 2 */}
                    <div className="md:w-[22%]">
                        <div className="flex flex-row items-center">
                            <img
                                src="https://www.coolmate.me/images/footer/icon-hotline.svg"
                                alt="icon"
                                className="h-5 w-5 lg:h-8 lg:w-8"
                            />
                            <div>
                                <div className="ml-4 text-sm font-semibold">Hotline</div>
                                <p className="ml-4 cursor-pointer text-base font-bold">
                                    1900.272737 - 028.7777.2737 (8:30 - 22:00)
                                </p>
                            </div>
                        </div>
                        <div className="my-5 flex flex-row items-center">
                            <img
                                src="https://www.coolmate.me/images/footer/icon-email.svg"
                                alt="icon"
                                className="h-5 w-5 lg:h-8 lg:w-8"
                            />
                            <div className="ml-4 cursor-pointer font-bold">
                                <p className="text-sm font-semibold">Email</p>
                                <p>Cool@coolmate.me</p>
                            </div>
                        </div>
                    </div>

                    {/* CỘT 3 - Mạng xã hội */}
                    <div className="flex h-auto w-full items-center justify-center gap-6 md:h-[130px] md:w-[30%] md:justify-between md:gap-0">
                        <img className="h-8 w-8 cursor-pointer object-contain md:h-10 md:w-10" src={FB} alt="icon" />
                        <img className="h-8 w-8 cursor-pointer object-contain md:h-10 md:w-10" src={ZALO} alt="icon" />
                        <img className="h-8 w-8 cursor-pointer object-contain md:h-10 md:w-10" src={TT} alt="icon" />
                        <img className="h-8 w-8 cursor-pointer object-contain md:h-10 md:w-10" src={IG} alt="icon" />
                        <img className="h-8 w-8 cursor-pointer object-contain md:h-10 md:w-10" src={YT} alt="icon" />
                    </div>
                </div>

                <hr className="lg:border-1 mx-0 hidden border-gray-700 " />

                {/* PHẦN GIỮA */}
                {/* <div className="mt-3 hidden grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid lg:grid-cols-5">
                    <div>
                        <p className="my-3 text-lg font-bold md:text-xl">COOLCLUB</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Đăng kí thành viên</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Ưu đãi & Đặc quyền</p>
                    </div>
                    <div>
                        <p className="my-3 text-lg font-bold md:text-xl">CHÍNH SÁCH</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Chính sách đổi trả 60 ngày</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Chính sách khuyến mãi</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Chính sách bảo mật</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Chính sách giao hàng</p>
                        <p className="mt-6 font-bold">COOLMATE.ME</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Lịch sử thay đổi website</p>
                    </div>
                    <div>
                        <p className="my-3 text-lg font-bold md:text-xl">CHĂM SÓC KHÁCH HÀNG</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Trải nghiệm mua sắm 100% hài lòng</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Hỏi đáp - FAQs</p>
                        <p className="mt-6 font-bold">KIẾN THỨC MẶC ĐẸP</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Hướng dẫn chọn size</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Blog</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Group mặc đẹp sống chất</p>
                    </div>
                    <div>
                        <p className="my-3 text-lg font-bold md:text-xl">TÀI LIỆU - TUYỂN DỤNG</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Tuyển dụng</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Đăng ký bản quyền</p>
                        <p className="mt-6 font-bold">VỀ COOLMATE</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Coolmate 101</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">DVKH xuất sắc</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Câu chuyện về Coolmate</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Nhà máy</p>
                        <p className="my-2 cursor-pointer hover:text-yellow-500">Care & Share</p>
                    </div>
                    <div>
                        <p className="my-3 text-lg font-bold md:text-xl">ĐỊA CHỈ LIÊN HỆ</p>
                        <p className="my-3 cursor-pointer hover:text-yellow-500">
                            <i className="not-italic underline">Văn phòng Hà Nội:</i> Tầng 3-4, Tòa nhà BMM, KM2, Đường
                            Phùng Hưng, Phường Phúc La, Quận Hà Đông, TP Hà Nội
                        </p>
                        <p className="my-3 cursor-pointer hover:text-yellow-500">
                            <i className="not-italic underline">Văn phòng Tp HCM:</i> Lầu 1, Số 163 Trần Trọng Cung,
                            Phường Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh
                        </p>
                    </div>
                </div> */}

                <hr className="border-1 mx-0 mt-6 border-gray-700" />

                {/* PHẦN CUỐI */}
                <div className="mt-2 flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="md:w-[60%]">
                        <p className="my-1 text-sm font-normal">@ CÔNG TY TNHH FASTECH ASIA</p>
                        <p className="my-1 text-sm font-normal">
                            Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu
                            tư TP Hà Nội cấp lần đầu ngày 20/02/2019.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <img className="w-20 cursor-pointer object-contain" src={NCSC} alt="icon" />
                        <img className="w-16 cursor-pointer object-contain" src={DMCA} alt="icon" />
                        <img className="w-10 cursor-pointer object-contain" src={ISO} alt="icon" />
                        <img className="w-24 cursor-pointer object-contain" src={BCT} alt="icon" />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
