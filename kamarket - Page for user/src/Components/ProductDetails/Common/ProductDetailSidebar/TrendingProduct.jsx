import { useContext, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import I18NextContext from '@/Helper/I18NextContext'
import request from '@/Utils/AxiosUtils'
import { ProductAPI } from '@/Utils/AxiosUtils/API'
import { useTranslation } from '@/app/i18n/client'
import { useQuery } from '@tanstack/react-query'
import { NumericFormat } from 'react-number-format'

const TrendingProduct = ({ productState }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const categoryId = useMemo(() => {
    return productState?.product?.categories?.map(elem => elem?.id)
  }, [productState?.product?.categories])
  const { data: productData, refetch: productRefetch } = useQuery(
    [categoryId],
    () =>
      request({
        url: ProductAPI,
        params: { status: 1, trending: 1, category_ids: categoryId?.join() },
      }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      select: data => data.data,
    }
  )
  useEffect(() => {
    categoryId?.length > 0 && productRefetch()
  }, [categoryId])
  if (productData?.length == 0) return null
  return (
    <div className="pt-25">
      <div className="category-menu">
        <h3>{t('TrendingProducts')}</h3>
        <ul className="product-list product-right-sidebar border-0 p-0">
          {productData?.slice(0, 4)?.map((elem, i) => (
            <li key={i}>
              <div className="offer-product">
                <Link
                  href={`/${i18Lang}/product/${elem?.slug}`}
                  className="offer-image"
                >
                  {elem?.product_thumbnail?.original_url && (
                    <Image
                      src={elem?.product_thumbnail?.original_url}
                      className="img-fluid"
                      alt={elem?.name}
                      height={80}
                      width={80}
                    />
                  )}
                </Link>

                <div className="offer-detail">
                  <div>
                    <Link href={`/${i18Lang}/product/${elem?.slug}`}>
                      <h6 className="name">{elem?.name}</h6>
                    </Link>
                    <span>{elem?.unit}</span>
                    <div className="vertical-price">
                      <h5 className="price theme-color">
                        <NumericFormat
                          className="span-text-price"
                          value={elem?.sale_price}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={''}
                        />
                        <span className="span-text-price">&#8363;</span>
                        <del className="text-content">
                          <NumericFormat
                            className="span-text-price-sale"
                            value={elem?.price}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={''}
                          />
                          <span className="span-text-price-sale">&#8363;</span>
                        </del>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TrendingProduct
