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
        <footer className="bg-black text-white ">
            <div className="my-0 ml-auto mr-auto w-[calc(100%-120px)] bg-black py-6 text-white">
                <div className="flex flex-row justify-between">
                    <div className="w-1/3">
                        <span className="text-2xl font-bold">COOLMATE lắng nghe bạn!</span> <br></br>
                        <span className="text-base ">
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể
                            nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </span>{' '}
                        <br></br>
                        <div className=" my-7 w-44 cursor-pointer rounded-[16px] bg-blue-600 py-2.5 text-center text-base font-medium hover:bg-white hover:text-black">
                            Đóng góp ý kiến
                        </div>
                    </div>
                    <div className="w-[22%]">
                        <div className="flex flex-row items-center">
                            <img src="https://www.coolmate.me/images/footer/icon-hotline.svg" alt="icon" />
                            <div className="">
                                <div className="ml-4 text-sm font-semibold">Hotline</div>
                                <p className="ml-4 w-60 cursor-pointer text-base font-bold">
                                    1900.272737 - 028.7777.2737 (8:30 - 22:00)
                                </p>
                            </div>
                        </div>
                        <div className="my-5 flex flex-row items-center">
                            <img src="https://www.coolmate.me/images/footer/icon-email.svg" alt="icon" />
                            <div className="ml-4 cursor-pointer font-bold">
                                <p className="text-sm font-semibold">Email</p>
                                <p>Cool@coolmate.me</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-[130px] w-[30%] items-center justify-between">
                        <img className="mr-8 h-10 w-10 cursor-pointer object-contain" src={FB} alt="icon" />
                        <img className="mr-8 h-10 w-10 cursor-pointer object-contain" src={ZALO} alt="icon" />
                        <img className="mr-8 h-10 w-10 cursor-pointer object-contain" src={TT} alt="icon" />
                        <img className="mr-8 h-10 w-10 cursor-pointer object-contain" src={IG} alt="icon" />
                        <img className="mr-8 h-10 w-10 cursor-pointer object-contain" src={YT} alt="icon" />
                    </div>
                </div>
                <hr className="border-1 mx-0 border-gray-700"></hr>
                <div className="mt-3 flex flex-row justify-between text-sm">
                    <div>
                        <p className="my-5 text-xl font-bold">COOLCLUB</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Đăng kí thành viên</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Ưu đãi & Đặc quyền</p>
                    </div>
                    <div>
                        <p className="my-5 text-xl font-bold">CHÍNH SÁCH</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">
                            Chính sách đổi trả 60 ngày
                        </p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Chính sách khuyến mãi</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Chính sách bảo mật</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Chính sách giao hàng</p>

                        <p className="mt-8 font-bold">COOLMATE.ME</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Lịch sử thay đổi website</p>
                    </div>
                    <div>
                        <p className="my-5 text-xl font-bold">CHĂM SÓC KHÁCH HÀNG</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">
                            Trải nghiệm mua sắm 100% hài lòng
                        </p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Hỏi đáp - FAQs</p>
                        <p className="mt-8 font-bold">KIẾN THỨC MẶC ĐẸP</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Hướng dẫn chọn size</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Blog</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Group mặc đẹp sống chất</p>
                    </div>
                    <div>
                        <p className="my-5 text-xl font-bold">TÀI LIỆU - TUYỂN DỤNG</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Tuyển dụng</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Đăng ký bản quyền</p>
                        <p className="my-5 mt-8 font-bold">VỀ COOLMATE</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Coolmate 101</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">DVKH xuất sắc</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Câu chuyện về Coolmate</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Nhà máy</p>
                        <p className="my-5 cursor-pointer text-base hover:text-yellow-500">Care & Share</p>
                    </div>
                    <div className="w-[20%]">
                        <p className="my-5 text-xl font-bold">ĐỊA CHỈ LIÊN HỆ</p>
                        <p className="my-6 cursor-pointer text-base hover:text-yellow-500">
                            <i className="not-italic underline decoration-solid ">Văn phòng Hà Nội:</i> Tầng 3-4, Tòa
                            nhà BMM, KM2, Đường Phùng Hưng, Phường Phúc La, Quận Hà Đông, TP Hà Nội
                        </p>
                        <p className="my-8 cursor-pointer text-base hover:text-yellow-500">
                            <i className="not-italic underline decoration-solid ">Văn phòng Tp HCM:</i> Lầu 1, Số 163
                            Trần Trọng Cung, Phường Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh
                        </p>
                    </div>
                </div>
                <hr className="border-1 mx-0 mt-6 border-gray-700"></hr>
                <div className="mt-2 flex flex-row justify-between">
                    <div className="w-[60%]">
                        <p className="my-2 text-sm font-normal">@ CÔNG TY TNHH FASTECH ASIA</p>
                        <p className="my-2 text-sm font-normal">
                            Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu
                            tư TP Hà Nội cấp lần đầu ngày 20/02/2019.
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <img className="mr-4 w-24 cursor-pointer object-contain" src={NCSC} alt="icon" />
                        <img className="mr-4 w-20 cursor-pointer object-contain" src={DMCA} alt="icon" />
                        <img className="mr-4 w-11 cursor-pointer object-contain" src={ISO} alt="icon" />
                        <img className="mr-4 w-28 cursor-pointer object-contain" src={BCT} alt="icon" />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
