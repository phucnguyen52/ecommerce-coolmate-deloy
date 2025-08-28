import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import ProductCard from "../../components/product/productCard";
import { HiArrowRight } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi";
import { useEffect } from "react";

const ListProducts = () => {
   const [data, setData] = useState();
   const [option, setOption] = useState("price");
   const [current, setCurrent] = useState(0);
   const slide = 5;
   const handleClick = (value) => {
      if (option !== value) {
         setOption(value);
         setCurrent(0);
      }
   }
   const fetData = async() =>{
      try {
         const req = await fetch(`http://localhost:8080/api/customer/product?sort=${option}&type=ASC&min=0&max=10000`)
         const res = await req.json()
         if(res.succes){
            setData(res.product)
         }
      } catch (error) {
         console.log("Error home product new sale", error)
      }
   }
   useEffect(()=>{
      fetData()
   },[option])
   // Update currentTime mỗi 1 giây
   useEffect(() => {
      if(data){
         const timer = setInterval(() => {
            if (current >= data.length - slide) setCurrent(0);
            else setCurrent(current + slide);
          }, 5000);
          return () => clearInterval(timer);
      }
   }, [current]);

   let previousSlide = () => {
      if (current === 0) setCurrent(data.length - slide + 1);
      else setCurrent(current - 1);
   };
   let nextSlide = () => {
      if (current >= data.length - slide + 1) setCurrent(0);
      else setCurrent(current + 1);
   };

   return (
      <>
         <div className="mb-20">
         <div className="flex gap-6 mb-5 ml-4">
            <button
               className={`${option === "new" ? `bg-black text-white` : 'bg-white text-black border border-black'} text-lg font-bold px-6 py-2 rounded-3xl  `}
               onClick={() => handleClick("new")}
            >
               Sản phẩm mới
            </button>
            <button
               className={`${option === "price" ? `bg-black text-white` : 'bg-white text-black border border-black'} text-lg font-bold px-6 py-2 rounded-3xl  `}
               onClick={() => handleClick("price")}
            >
               Bán chạy nhất
            </button>
         </div>
         <div className="overflow-hidden relative ml-4">
            <div
               className={`flex transition ease-out duration-40 h-500px`}
               style={{
                  transform: `translateX(calc(-${current} * ((100vw - 2rem*${slide} - 1rem)/${slide}) - ${current} * 2rem))`,
                  transition: `2s`
               }}
            >
               {data&&data.map(product => (
                  <div key={product.id} className=" mr-8 " style={{ minWidth: `calc((100vw - 2rem*${slide} - 1rem)/${slide})` }}>
                     <ProductCard value={product} />
                  </div>
               ))}
            </div>
            <div onClick={previousSlide} className='absolute top-1/2 left-0 text-2xl rounded-full bg-black p-3 bg-opacity-15'>
               <HiArrowLeft />
            </div>
            <div onClick={nextSlide} className='absolute top-1/2 right-4 text-2xl rounded-full bg-black p-3 bg-opacity-15'>
               <HiArrowRight />
            </div>
         </div>
         </div>
      </>
   );
}
export default ListProducts;