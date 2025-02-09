import { useContext, useEffect, useState } from 'react'
import { AccordionBody, Input, Label } from 'reactstrap'
import CategoryContext from '@/Helper/CategoryContext'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCustomSearchParams } from '@/Utils/Hooks/useCustomSearchParams'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const CollectionCategory = ({ filter, setFilter }) => {
  const params = useParams()
  const lang = params?.lng
  const [attribute, price, rating, sortBy, field, layout] =
    useCustomSearchParams([
      'attribute',
      'price',
      'rating',
      'sortBy',
      'field',
      'layout',
    ])
  const { filterCategory, setCategoryLang } = useContext(CategoryContext)
  const categoryData = filterCategory('product')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (lang) {
      setCategoryLang({ lang: lang});
    }  
  }, [lang])

  const redirectToCollection = (event, slug) => {
    event.preventDefault()
    // let temp = [...filter?.category]
  //   if (!temp.includes(slug)) {
  //     temp.push(slug)
  //   } else {
  //     temp = temp.filter(elem => elem !== slug)
  //   }
  //   setFilter(prev => {
  //     return {
  //       ...prev,
  //       category: temp,
  //     }
  //   })
  //   if (temp.length > 0) {
  //     const queryParams = new URLSearchParams({
  //       ...attribute,
  //       ...price,
  //       ...sortBy,
  //       ...field,
  //       ...rating,
  //       ...layout,
  //       category: temp,
  //     }).toString()
  //     router.push(`${pathname}?${queryParams}`)
  //   } else {
  //     const queryParams = new URLSearchParams({
  //       ...attribute,
  //       ...price,
  //       ...sortBy,
  //       ...field,
  //       ...rating,
  //       ...layout,
  //     }).toString()
  //     router.push(`${pathname}?${queryParams}`)
  //   }
    router.push(`${pathname}?category=${slug}`)
  }
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  console.log('categoryData', categoryData)
  return (
    // <></>
    <AccordionBody accordionId="1">
      <ul className="category-list custom-padding custom-height">
        {categoryData?.map((elem, i) => (
          <>
          <li key={i}>
            <div className="form-check category-list-box">
              {/* <Input
                className="checkbox_animated"
                type="checkbox"
                id={elem?.name}
                checked={filter?.category?.includes(elem?.slug)}
                onChange={e => redirectToCollection(e, elem?.slug)}
              /> */}
              <Label className="form-check-label" htmlFor={elem?.name}>
                <span className="name">{elem?.translations?.name || elem?.name}</span>
                {/* <span className="number">({elem?.products_count})</span> */}
              </Label>
            </div>
          </li>
          {elem?.subcategories?.map((elem, i) => (
            <li key={i}>
            <div className="form-check category-list-box">
              <Input
                className="checkbox_animated"
                type="checkbox"
                id={elem?.name}
                checked={filter?.category?.includes(elem?.id)}
                onChange={e => redirectToCollection(e, elem?.id)}
              />
              <Label className="form-check-label" htmlFor={elem?.name}>
                <span className="name">{elem?.translations?.name || elem?.name}</span>
                {/* <span className="number">({elem?.products_count})</span> */}
              </Label>
            </div>
            </li>
          ))}
          </>
        ))}
      </ul>
    </AccordionBody>
  )
}

export default CollectionCategory
