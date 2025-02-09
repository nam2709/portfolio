'use client'
import Breadcrumb from '@/Components/Common/Breadcrumb'
import WrapperComponent from '@/Components/Common/WrapperComponent'
import AccountSidebar from '../Common/AccountSidebar'
import { Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import ResponsiveMenuOpen from '../Common/ResponsiveMenuOpen'
import MyOrders from './MyOrders'
import { useState, useContext } from 'react'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'

const AccountOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <Breadcrumb title={'Orders'} subNavigation={[{ name: 'Orders' }]} />
      <WrapperComponent
        classes={{ sectionClass: 'user-dashboard-section section-b-space' }}
        customCol={true}
      >
        <AccountSidebar tabActive={'order'} />
        <Col xxl={9} lg={8}>
          <ResponsiveMenuOpen />
          <div className="dashboard-right-sidebar">
            <Nav tabs className='d-between nav-responsive'>
              <NavItem>
                <NavLink
                  className={activeTab === 'all' ? 'active' : ''}
                  onClick={() => handleTabChange('all')}
                >
                  {t('Tất cả')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'checkout' ? 'active' : ''}
                  onClick={() => handleTabChange('checkout')}
                >
                  {t('Chờ xác nhận')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'confirm' ? 'active' : ''}
                  onClick={() => handleTabChange('confirm')}
                >
                  {t('Chờ đóng hàng')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'shipping' ? 'active' : ''}
                  onClick={() => handleTabChange('shipping')}
                >
                  {t('Vận chuyển')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'order' ? 'active' : ''}
                  onClick={() => handleTabChange('order')}
                >
                  {t('Chờ giao hàng')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'finished' ? 'active' : ''}
                  onClick={() => handleTabChange('finished')}
                >
                  {t('Hoàn thành')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'paid' ? 'active' : ''}
                  onClick={() => handleTabChange('paid')}
                >
                  {t('Đã huỷ')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'return' ? 'active' : ''}
                  onClick={() => handleTabChange('return')}
                >
                  {t('Trả hàng/hoàn tiền')}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className='tab-responsive' activeTab={activeTab} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <TabPane tabId="all">
                <MyOrders />
              </TabPane>
              <TabPane tabId="checkout">
                <MyOrders status='pending'/>
                {/* Render content for "Chờ thanh toán" tab */}
              </TabPane>
              <TabPane tabId="confirm">
                <MyOrders status='processing'/>
                {/* Render content for "Vận chuyển" tab */}
              </TabPane>
              <TabPane tabId="shipping">
                <MyOrders status='shipped'/>
                {/* Render content for "Vận chuyển" tab */}
              </TabPane>
              <TabPane tabId="order">
                <MyOrders status='out-for-delivery'/>
                {/* Render content for "Chờ giao hàng" tab */}
              </TabPane>
              <TabPane tabId="finished">
                <MyOrders status='delivered'/>
                {/* Render content for "Hoàn thành" tab */}
              </TabPane>
              <TabPane tabId="paid">
                {/* <MyOrders status='shipped'/> */}
                {/* Render content for "Đã huỷ" tab */}
              </TabPane>
              <TabPane tabId="return">
                {/* <MyOrders status='shipped'/> */}
                {/* Render content for "Trả hàng/hoàn tiền" tab */}
              </TabPane>
            </TabContent>
            {/* <TabContent activeTab="1">
              <TabPane tabId="1">
                <MyOrders />
              </TabPane>
              <TabPane tabId="2">
                <MyOrders />
              </TabPane>
            </TabContent> */}
          </div>
        </Col>
      </WrapperComponent>
    </>
  )
}

export default AccountOrders
