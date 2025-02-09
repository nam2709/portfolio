import { useContext, useState } from 'react'
import { Input, InputGroup } from 'reactstrap'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { useRouter } from 'next/navigation'
import { RiSearchLine } from 'react-icons/ri'
import { useTranslation } from '@/app/i18n/client'
const HeaderSearchBar = () => {
  const [searchValue, setSearchValue] = useState('')
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const router = useRouter()
  const onHandleSearch = () => {
    if (searchValue) {
      router.push(`/${i18Lang}/search?search=${searchValue}`)
    } else {
      router.push(`/${i18Lang}/search`)
    }
  }
  return (
    <div className="middle-box">
      {/* <div className='location-box'>
        <CategoryDropdown />
      </div> */}
      <div className="search-box">
        <InputGroup>
          <Input
            type="search"
            className="form-control"
            placeholder={t("Tìm kiếm tên sản phẩm - Săn sale hàng chính hiệu")}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Btn
            className="btn"
            type="button"
            id="button-addon2"
            onClick={onHandleSearch}
          >
            <RiSearchLine />
          </Btn>
        </InputGroup>
      </div>
    </div>
  )
}

export default HeaderSearchBar
