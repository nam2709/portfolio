import { usePathname, useRouter } from 'next/navigation'
import { AccordionBody, AccordionHeader, AccordionItem, Input, Label } from 'reactstrap'
import { useCustomSearchParams } from '@/Utils/Hooks/useCustomSearchParams'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { useContext } from 'react'

const CollectionAttributes = ({ attributeAPIData, filter, setFilter }) => {
  const router = useRouter()
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [category, price, rating, sortBy, field, layout] = useCustomSearchParams([
    'category',
    'price',
    'rating',
    'sortBy',
    'field',
    'layout',
  ])
  const pathname = usePathname()

  const checkAttribute = slug => {
    const prefixedSlug = `TP-${slug}`
    return filter?.attribute?.indexOf(prefixedSlug) !== -1
  }

  const applyAttribute = event => {
    const { value, checked } = event.target;
    const prefixedValue = `TP-${value}`;
    const index = filter.attribute.indexOf(prefixedValue);
    let temp = [...filter.attribute];

    if (checked && index === -1) {
        temp.push(prefixedValue);
    } else if (!checked && index !== -1) {
        temp.splice(index, 1);
    }

    setFilter(prev => ({
        ...prev,
        attribute: temp,
    }));

    // Construct the query parameters dynamically based on existing filters and adjustments
    const queryParams = new URLSearchParams({
        ...category,
        ...price,
        ...rating,
        ...sortBy,
        ...field,
        ...layout,
    });

    // Only add the 'attribute' parameter if there are any attributes left
    if (temp.length > 0) {
        queryParams.set('attribute', temp.join(','));
    } else {
        queryParams.delete('attribute');  // Ensure that the 'attribute' parameter is removed
    }

    // Use the updated query parameters in the URL
    router.push(`${pathname}?${queryParams.toString()}`);
  }

  return (
    <>
      {attributeAPIData?.length > 0 && attributeAPIData?.map((attribute, i) => (
        <AccordionItem key={i}>
          <AccordionHeader targetId={(i + 2).toString()}>
            <span>{t(attribute.name)}</span>
          </AccordionHeader>
          {attribute.attribute_values?.length > 0 && attribute.attribute_values?.map((value, index) => (
            <AccordionBody accordionId={(i + 2).toString()} key={index}>
              <ul className="category-list custom-padding">
                <li>
                  <div className="form-check m-0 category-list-box">
                    <Input
                      className="checkbox_animated"
                      type="checkbox"
                      value={value.slug}
                      id={value.value}
                      checked={checkAttribute(value.slug)}
                      onChange={applyAttribute}
                    />
                    <Label className="form-check-label color-label-box" htmlFor={value.value}>
                      {attribute.style === 'color' && (
                        <div className="color-box" style={{ backgroundColor: value.hex_color }}></div>
                      )}
                      <span className="name">{value.value}</span>
                    </Label>
                  </div>
                </li>
              </ul>
            </AccordionBody>
          ))}
        </AccordionItem>
      ))}
    </>
  )
}

export default CollectionAttributes
