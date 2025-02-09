import { useContext, useState } from 'react'
import CollectionProducts from './CollectionProducts'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { RiFilterFill } from 'react-icons/ri'

const MainCollection = ({ initialGrid = 6 }) => {
  const [grid, setGrid] = useState(initialGrid)
  const { setCollectionMobile } = useContext(ThemeOptionContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')

  return (
    <div className="col-customer-12">
      <div className="show-button">
        <div className="filter-button-group mt-0">
          <div
            className="filter-button d-inline-block d-lg-none"
            onClick={() => setCollectionMobile(prev => !prev)}
          >
            <a>
              <RiFilterFill /> {t('FilterMenu')}
            </a>
          </div>
        </div>
      </div>
      <CollectionProducts grid={grid} />
    </div>
  )
}

export default MainCollection
