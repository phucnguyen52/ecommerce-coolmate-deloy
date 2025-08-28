import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = (props) => {
   const { rating,css } = props
   const fullStars = Math.floor(rating);
   const remainder = rating - fullStars;
   const emptyStars = 5 - Math.ceil(rating);
   
   return (
      <>
         <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, index) => (
               <FaStar key={index} className={css} />
            ))}
            {remainder > 0 && (
               <FaStarHalfAlt className={css} />
            )}
            {[...Array(emptyStars)].map((_, index) => (
               <FaRegStar key={index} className={css} />
            ))}
         </div>
      </>
   );
}
export default StarRating;