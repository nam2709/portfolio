import React, { useContext } from 'react'
import Link from 'next/link'
import { RiCloseLine } from 'react-icons/ri'
import ProductBoxAction from './ProductBox1Action'
import ProductBox1Cart from './ProductBox1Cart'
import ProductBox1Rating from './ProductBox1Rating'
import Avatar from '../../Avatar'
import { placeHolderImage } from '../../../../../Data/CommonPath'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import ProductBagde from './ProductBagde'
import SettingContext from '@/Helper/SettingContext'
import { ModifyString } from '@/Utils/CustomFunctions/ModifyString'
import { NumericFormat } from 'react-number-format'

const ProductBox1 = ({
  imgUrl,
  productDetail,
  isClose,
  addAction = true,
  classObj,
  setWishlistState,
  setWishlistProducts,
  deleteItem
}) => {
  const { i18Lang } = useContext(I18NextContext)
  const { convertCurrency } = useContext(SettingContext)
  const handelDelete = currObj => {
    setWishlistState(prev => prev.filter(elem => elem.id !== currObj?.id))
    setWishlistProducts(prev => prev.filter(elem => elem.id !== currObj?.id))
    deleteItem(currObj?.id)
  }
  // console.log('imgUrlimgUrl', imgUrl)
  // console.log('productDetailproductDetail', productDetail)
  return (
    <div className={`product-box ${classObj?.productBoxClass} h-100`}>
      <ProductBagde productDetail={productDetail} />
      {isClose && (
        <div className="product-header-top" onClick={() => handelDelete(productDetail)}>
          <Btn className="wishlist-button close_button">
            <RiCloseLine />
          </Btn>
        </div>
      )}
      <div className="product-image">
        <Link href={`/${i18Lang}/product/${productDetail?.id}`}>
          <Avatar
            data={imgUrl}
            placeHolder={placeHolderImage}
            customeClass={'img-fluid'}
            name={productDetail.title}
            height={500}
            width={500}
          />
        </Link>
        <ProductBoxAction productObj={productDetail} listClass="product-option" />
      </div>
      <div className="product-detail p-2">
        <Link href={`/${i18Lang}/product/${productDetail?.id}`}>
          <h6 className="name">{productDetail.name}</h6>
          <p
            dangerouslySetInnerHTML={{
              __html: productDetail?.short_description,
            }}
          />
        </Link>
        <h5 className="sold text-content">
          <span className="theme-color price"> 
          {productDetail?.price !== productDetail?.sale_price ? (
            <>
            <NumericFormat value={productDetail?.price} className="span-text-price-sale" isplayType={'text'} thousandSeparator={true} prefix={''} style={{ border: "0px" }}/>
            <NumericFormat
              className="span-text-price"
              value={productDetail?.sale_price || 350000}
              displayType={'text'}
              thousandSeparator={true}
              prefix={''}
            />
            <span className="span-text-price">&#8363;</span>
            </>
            ) : (
            <>
            <NumericFormat className="span-text-price-sale" isplayType={'text'} thousandSeparator={true} prefix={''} style={{ border: "0px" }}/>
            <NumericFormat
              className="span-text-price"
              value={productDetail?.sale_price || 350000}
              displayType={'text'}
              thousandSeparator={true}
              prefix={''}
            />
            <span className="span-text-price">&#8363;</span>
            </>
            )}
          </span>
        </h5>
        <div className="d-flex justify-content-between">
          <div className="product-rating mt-sm-2 mt-1">
            <ProductBox1Rating totalRating={productDetail?.rating_count || 0} />
          </div>
          <div>
            <h6 className="unit mt-2" style={{ WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>Đã bán {productDetail?.orders_count}</h6>
          </div>
        </div>
        <div>
          <h6 className="unit mt-2" style={{ WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>{productDetail?.store?.city}</h6>
        </div>
        {/* {addAction && <ProductBox1Cart productObj={productDetail} />} */}
      </div>
    </div>
  )
}

export default ProductBox1
