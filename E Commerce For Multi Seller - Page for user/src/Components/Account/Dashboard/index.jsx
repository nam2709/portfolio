'use client'
import Breadcrumb from '@/Components/Common/Breadcrumb'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import AccountSidebar from '../Common/AccountSidebar'
import { Col, TabContent, TabPane } from 'reactstrap'
import DashboardContent from './DashboardContent'
import ResponsiveMenuOpen from '../Common/ResponsiveMenuOpen'
import AccountContext from '@/Helper/AccountContext'
import I18NextContext from '@/Helper/I18NextContext'
import React, { useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'

const AccountDashboard = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { login, auth } = useContext(AccountContext)
  const router = useRouter()

  useEffect(() => {
    const authentication = async () => {
      if (!auth?.userId && i18Lang) {
        const loginPath = `/${i18Lang}/auth/login`
        router.push(loginPath);
        return loginPath
      }
    }
    authentication()
  }, [!auth?.userId, i18Lang])
  
  return (
    <>
      <Breadcrumb
        title={'UserDashboard'}
        subNavigation={[{ name: 'UserDashboard' }]}
      />
      <WrapperComponent
        classes={{ sectionClass: 'user-dashboard-section section-b-space' }}
        customCol={true}
      >
        <AccountSidebar tabActive={'dashboard'} />
        <Col xxl={9} lg={8}>
          <ResponsiveMenuOpen />
          <div className="dashboard-right-sidebar">
            <TabContent>
              <TabPane className="show active">
                <DashboardContent />
              </TabPane>
            </TabContent>
          </div>
        </Col>
      </WrapperComponent>
    </>
  )
}

export default AccountDashboard
