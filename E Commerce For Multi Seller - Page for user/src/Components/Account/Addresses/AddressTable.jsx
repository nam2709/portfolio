import AccountContext from '@/Helper/AccountContext'
import { useContext } from 'react'
import { Table } from 'reactstrap'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const AddressTable = ({ address }) => {
  // console.log('ADDRESS', address)
  const { accountData, auth } = useContext(AccountContext)
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  return (
    <div>
      <div className="label">
        <label>{address?.title || address?.street}</label>
      </div>
      <div className="table-responsive address-table">
        <Table>
          <tbody>
            <tr>
              <td colSpan="2">{address?.addressId}</td>
            </tr>

            <tr>
              <td>{t('Address')} :</td>
              <td>
                <p>
                  {address?.street},<br />
                  {address?.ward},<br />
                  {address?.district},<br />
                  {address?.city},{address?.country}
                </p>
              </td>
            </tr>
            {address?.pincode && (
              <tr>
                <td>Pin Code :</td>
                <td>{address?.pincode}</td>
              </tr>
            )}
            {address?.phone && (
              <tr>
                <td>{t('Phone')} :</td>
                <td>
                  0{address?.country_code}{address?.phone}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default AddressTable
