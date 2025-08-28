import { Link } from 'react-router-dom'
import ProductCard from '../../components/product/productCard'
import {color} from '../../utils/Constants'

const OutstandingProducts = (props) => {
   const {poster,title,description,data} = props
      
   return (
      <>
         <div className='my-8'>
            <div className='relative'>
               <Link>
                  <img className='w-full h-full object-cover' src={poster} alt="" />
               </Link>
               <div className='absolute bottom-10 max-w-[50%] pl-8'>
                  <h2 className='text-[5rem] font-bold'>{title}</h2>
                  <div className='my-6'>{description}</div>
                  <Link>
                     <div className={`bg-[${color.blue}] rounded-[100px] px-10 py-4 w-fit text-white`}>KHÁM PHÁ NGAY</div>
                  </Link>
               </div>
            </div>
            <div className='m-4'>
               <div className='flex justify-between items-center'>
               <div className='text-3xl mt-8 mb-4 font-medium'>SẢN PHẨM {title}</div>
               <Link><div className='text-base underline mt-4'>Xem thêm</div></Link>
               </div>
               {data&&
                  <div className='flex gap-4'>
                     {data.map((item,index)=>(
                        <ProductCard key={index} value={item}/>
                     ))}
                  </div>
               }
            </div>
         </div>
      </>
   );
}

export default OutstandingProducts;