'use client'
import { useContext, useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import './BuyingGuide.css'
import TextLimit from '@/Utils/CustomFunctions/TextLimit'
import { useSearchParams, usePathname, useParams } from 'next/navigation'
import { fetchAuthSession } from "aws-amplify/auth"

const PolicyGet = async (values) => {
  console.log('Form values:', values);
  const token = await fetchAuthSession();
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-setting`, {
      // const response = await fetch('http://localhost:4000/get-setting', {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`
          },
          body: JSON.stringify(values)
      });
      const data = await response.json();
      return data.Item;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
};

const BuyingGuide = () => {
  const [data, setData] = useState(null)
  const param = useParams();
  const language = param.lng;
  console.log('language', language)

  useEffect(() => {
    const fetchData = async () => {
        const response = await PolicyGet({ action: 'BUYINGUIDE', language: language });
        console.log('response', response)
        setData(response);
    };

    fetchData();
  }, [language]);

  return (
    <>
      <Breadcrumb title={'Buying Guide'} subNavigation={[{ name: 'Buying Guide' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'fresh-vegetable-section section-lg-space',
          row: 'gx-xl-5 gy-xl-0 g-3 ratio_148_1',
        }}
        customCol
      >
        <div
            key="operation-regulations"
            id="operation-regulations"
            className={`faq-section`}
        >
        <div class="container">
          <TextLimit value={data?.description} />
            {/* <div xs="24">
              <p className="text-center">
                  <strong style={{
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '38px',
                          lineHeight: '120%',
                          marginBottom: '30px',
                          color: '#002b41'
                      }}>Hướng dẫn mua sản phẩm tại Kamarket</strong>
              </p>
              <div>
                  <div class="book-buying-guide-cost">
                  <p><strong>Bước 1: Truy cập vào trang web</strong></p>
                  <p>Vào trình duyệt web của bạn và truy cập vào địa chỉ của trang web Kamarket.</p>

                  <p><strong>Bước 2: Tìm kiếm sản phẩm</strong></p>
                  <p>Sử dụng thanh tìm kiếm ở trang chủ để tìm kiếm sản phẩm bạn muốn mua. Bạn có thể tìm theo tên sản phẩm, loại sản phẩm, hoặc theo mùa vụ.</p>
                  <p>Hoặc bạn có thể duyệt các danh mục sản phẩm để tìm kiếm. Các danh mục thường được phân loại theo loại sản phẩm, nguồn gốc, và tính mùa vụ.</p>

                  <p><strong>Bước 3: Chọn sản phẩm vào giỏ hàng</strong></p>
                  <p>Khi tìm thấy sản phẩm bạn muốn mua, bấm vào nút "Thêm vào giỏ hàng".</p>
                  <p>Nếu muốn mua nhiều sản phẩm, hãy thêm từng sản phẩm vào giỏ hàng. Bạn có thể xem giỏ hàng bất cứ lúc nào để kiểm tra.</p>

                  <p><strong>Bước 4: Thanh toán</strong></p>
                  <p>Khi đã chọn đủ sản phẩm, bấm vào biểu tượng giỏ hàng và chọn "Thanh toán".</p>
                  <p>Tại trang thanh toán, kiểm tra thông tin giao hàng, nhập thông tin thanh toán và xác nhận đơn hàng.</p>
                  <p>Bạn có thể thanh toán bằng tiền mặt hoặc các phương thức trực tuyến khác.</p>
                  <p>Nhấp vào nút "Đặt hàng" để hoàn tất.</p>

                  <p><strong>Bước 5: Theo dõi đơn hàng</strong></p>
                  <p>Đăng nhập vào tài khoản trên web để xem trạng thái đơn hàng mới nhất của bạn.</p>

                  <p><strong>Bước 6: Nhận hàng</strong></p>
                  <p>Khi sản phẩm được giao, hãy kiểm tra lại đơn hàng trước khi thanh toán với nhân viên giao hàng.</p>
                  <p>Chúc bạn mua sắm online vui vẻ tại Kamarket!</p>
                  </div>
              </div>
            </div> */}
        </div>
        </div>
      </WrapperComponent>
    </>
  )
}

export default BuyingGuide
