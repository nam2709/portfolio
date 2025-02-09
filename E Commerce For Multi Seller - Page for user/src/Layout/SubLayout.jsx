import MainFooter from './Footer'
import MainHeader from './Header'
import MobileMenu from './MobileMenu'
import StickyCompare from './StickyCompare'
import TapTop from './TapTop'

const SubLayout = ({ children }) => {
  return (
    <>
      <MainHeader />
      <MobileMenu />
      {children}
      <TapTop />
      <MainFooter />
      <StickyCompare />
    </>
  )
}

export default SubLayout
