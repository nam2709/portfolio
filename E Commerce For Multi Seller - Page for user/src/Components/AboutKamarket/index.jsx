'use client'
import { useContext, useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import './AboutKamarket.css'
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

const AboutKamarket = () => {
  const [data, setData] = useState(null)
  const param = useParams();
  const language = param.lng;
  console.log('language', language)

  useEffect(() => {
    const fetchData = async () => {
        const response = await PolicyGet({ action: 'ABOUTUS', language: language });
        console.log('response', response)
        setData(response);
    };

    fetchData();
  }, [language]);

  return (
    <>
      <Breadcrumb title={'About Kamarket'} subNavigation={[{ name: 'About Kamarket' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'fresh-vegetable-section section-lg-space',
          row: 'gx-xl-5 gy-xl-0 g-3 ratio_148_1',
        }}
        customCol
      >
        <div
            key=""
            id=""
            className={`faq-section`}
        >
          <TextLimit value={data?.description} />
            {/* <div class="container">
                <div>
                <p className="text-center">
                    <strong style={{
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontSize: '38px',
                        lineHeight: '120%',
                        marginBottom: '30px',
                        color: '#002b41'
                    }}>Chào mừng bạn đến với chợ nông sản Kamarket</strong>
                </p>
                </div>
                <div>
                <div class="faq-page-cost">
                    <p>Với mong muốn đem lại những sản phẩm nông sản tươi tốt đến người dân Việt Nam, Kamarket tự hào là chợ nông sản hàng đầu về các sản phẩm tươi dùng, chất lượng cao.</p>
                    <p>Kamarket cung cấp nguồn nông sản phong phú, từ rau củ đến trái cây và nhiều loại hạt, đảm bảo sự đa dạng và tươi mới của các sản phẩm.</p>
                    <p>Sứ mệnh của chúng tôi là cung cấp các sản phẩm nông sản sạch, bảo vệ sức khỏe của người tiêu dùng và hỗ trợ cộng đồng nông dân Việt Nam.</p>
                    <p>Cam kết của Kamarket:</p>
                    <p>- Luôn cập nhật đầy đủ các loại nông sản mới</p>
                    <p>- Giá cả cạnh tranh, khuyến mãi hấp dẫn</p>
                    <p>- Giao hàng nhanh chóng, đảm bảo chất lượng</p>
                    <p>Cảm ơn bạn đã tin tưởng Kamarket!</p>
                </div>
                </div>
            </div> */}
        </div>
      </WrapperComponent>
    </>
  )
}

export default AboutKamarket
