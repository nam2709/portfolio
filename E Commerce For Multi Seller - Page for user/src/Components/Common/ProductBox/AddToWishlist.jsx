import { useContext } from 'react'
import Cookies from 'js-cookie'
import { RiHeartLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import Btn from '@/Elements/Buttons/Btn'
import AccountContext from '@/Helper/AccountContext'
import { fetchAuthSession } from 'aws-amplify/auth'
import WishlistContext from '@/Helper/WishlistContext'

const AddToWishlist = ({ productObj, customClass }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { auth } = useContext(AccountContext);
  const { WishlistProducts, setWishlistProducts } = useContext(WishlistContext)
  const router = useRouter()

  const handleWishlist = async (productObj) => {
    const token = await fetchAuthSession().catch(console.error)
    if (token?.tokens?.idToken.toString()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.tokens?.idToken.toString()}`,
          },
          body: JSON.stringify({ productId: productObj?.id }),
        });
        if (response.ok) {
          setWishlistProducts(prevState => {
            // First check if prevState is an array
            if (Array.isArray(prevState)) {
              // Check if the product ID already exists in the state
              const isProductAlreadyInWishlist = prevState.some(product => product.id === productObj.id);
            
              // If not, add the product to the state
              if (!isProductAlreadyInWishlist) {
                return [...prevState, productObj];
              }
            }
            // If the product is already in the wishlist, or prevState was not an array, return the unchanged state
            return prevState;
          });
        }
        // Handle success, e.g., show a notification
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        // Handle error, e.g., show an error message
      }
    } else {
      router.push(`/${i18Lang}/auth/login`);
    }
  };

  return (
    <>
      {customClass ? (
        <Btn
          className={customClass}
          onClick={() => handleWishlist(productObj)}
        >
          <RiHeartLine />
        </Btn>
      ) : (
        <li title="Wishlist" onClick={() => handleWishlist(productObj)}>
          <a className='notifi-wishlist'>
            <RiHeartLine />
          </a>
        </li>
      )}
    </>
  );
};

export default AddToWishlist;
