import React from 'react';

const PageNumber = ({num, setPage, page}) => {
   const handlePage = (num) => {
      setPage(num)
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
   return (
      <div className='flex gap-2 mt-[50px] mb-10 justify-center'>
         {Array.from({ length: num }, (_, index) => (
            <button
               key={index}
               className={`border py-1 px-4 hover:border-blue-400 hover:text-blue-500 
                  ${page === index + 1 ? 'border-blue-400 text-blue-500' : ''}`}
               onClick={() => handlePage(index + 1)}
            >
               {index + 1}
            </button>
         ))}
      </div>
   );
};

export default PageNumber;