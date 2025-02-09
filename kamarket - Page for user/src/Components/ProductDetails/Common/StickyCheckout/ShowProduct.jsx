import { useContext } from 'react'
import { Col, Row } from 'reactstrap'
import ProductDetailAction from '../ProductDetailAction'
import Avatar from '@/Components/Common/Avatar'
import { placeHolderImage } from '../../../../../Data/CommonPath'
import SettingContext from '@/Helper/SettingContext'
import ProductAttribute from '../ProductAttribute/ProductAttribute'
import { NumericFormat } from 'react-number-format'

const ShowProduct = ({ productState, setProductState }) => {
  const { convertCurrency } = useContext(SettingContext)
  return (
    <div className="sticky-bottom-cart">
      <div className="container-fluid-lg">
        <Row>
          <Col xs={12}>
            <div className="cart-content">
              <div className="product-image">
                <Avatar
                  data={
                    productState?.product?.product_galleries[0] ??
                    productState?.selectedVariation?.variation_image ??
                    productState?.product?.product_thumbnail
                  }
                  placeHolder={placeHolderImage}
                  name={
                    productState?.selectedVariation
                      ? productState?.selectedVariation?.name
                      : productState?.product?.name
                  }
                />
                <div className="content">
                  <h5>
                    {productState?.selectedVariation
                      ? productState?.selectedVariation?.name
                      : productState?.product?.name}
                  </h5>
                  <h6>
                    <NumericFormat
                      className="span-text-price"
                      value={
                        productState?.selectedVariation
                          ? productState?.selectedVariation?.sale_price
                          : productState?.product?.sale_price
                      }
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={''}
                    />
                    <span className="span-text-price">&#8363;</span>
                    {productState?.selectedVariation?.discount ??
                    productState?.product?.discount ? (
                      <>
                        <del className="text-danger">
                          <NumericFormat
                            className="span-text-price-sale"
                            value={
                              productState?.selectedVariation
                                ? productState?.selectedVariation?.price
                                : productState?.product?.price
                            }
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={''}
                          />
                          <span className="span-text-price-sale">&#8363;</span>
                        </del>
                        <span className="span-text-price">
                          {productState?.selectedVariation
                            ? productState?.selectedVariation?.discount
                            : productState?.product?.discount}
                          % Giảm
                        </span>
                      </>
                    ) : null}
                  </h6>
                </div>
              </div>
              <ProductAttribute
                productState={productState}
                setProductState={setProductState}
                stickyAddToCart={true}
              />
              <ProductDetailAction
                productState={productState}
                setProductState={setProductState}
                extraOption={false}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ShowProduct
