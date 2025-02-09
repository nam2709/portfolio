'use client'
import { useContext, useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import './GuaranteePolicy.css'
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

const GuaranteePolicy = () => {
  const [data, setData] = useState(null)
  const param = useParams();
  const language = param.lng;
  console.log('language', language)

  useEffect(() => {
    const fetchData = async () => {
        const response = await PolicyGet({ action: 'GUARANTEEPOLICY', language: language });
        console.log('response', response)
        setData(response);
    };

    fetchData();
  }, [language]);

  return (
    <>
      <Breadcrumb title={'Guarantee Policy'} subNavigation={[{ name: 'Guarantee Policy' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'fresh-vegetable-section section-lg-space',
          row: 'gx-xl-5 gy-xl-0 g-3 ratio_148_1',
        }}
        customCol
      >
        <div
            key="guarantee-policy"
            id="guarantee-policy"
            className={`faq-section`}
        >
          <TextLimit value={data?.description} />
            {/* <div class="container"><div><p className="text-center"><strong style={{
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontSize: '38px',
                        lineHeight: '120%',
                        marginBottom: '30px',
                        color: '#002b41'
                    }}>CHÍNH SÁCH BẢO HÀNH – BỒI HOÀN</strong></p></div><div><div class="return-policy-cost"><p><strong>Áp dụng cho toàn bộ đơn hàng của Quý Khách tại Kamarket.vn</strong></p><p><strong>1. Tôi có thể bảo hành sản phẩm tại đâu?</strong></p><p>- Bảo hành thông qua Kamarket.vn: khách hàng liên hotline 0896658585 hoặc truy cập www.kamarket.vn/vi/guarantee-policy để được hỗ trợ tư vấn về thực hiện bảo hành.</p><p><strong>2. Tôi có thể được bảo hành sản phẩm miễn phí không?</strong></p><p><strong>Sản phẩm của quý khách được bảo hành miễn phí chính hãng khi:</strong></p><p>Còn thời hạn bảo hành (dựa trên tem/phiếu bảo hành hoặc thời điểm kích hoạt bảo hành điện tử).</p><p>Tem/phiếu bảo hành còn nguyên vẹn.</p><p>Sản phẩm bị lỗi kỹ thuật.</p><p><strong>Các trường hợp có thể phát sinh phí bảo hành:</strong></p><p>Sản phẩm hết thời hạn bảo hành.</p><p>Sản phẩm bị bể, biến dạng, cháy, nổ, ẩm thấp trong động cơ hoặc hư hỏng trong quá trình sử dụng.</p><p>Sản phẩm bị hư hỏng do lỗi của người sử dụng, không xuất phát từ lỗi vốn có của hàng hóa.</p><p><strong>3. Sau bao lâu tôi có thể nhận lại sản phẩm bảo hành?</strong></p><p>Nếu sản phẩm của quý khách vẫn còn trong thời hạn bảo hành trên team phiếu bảo hành của Hãng, Kamarket khuyến khích quý khách gửi trực tiếp đến trung tâm của Hãng để được hỗ trợ bảo hành trong thời gian nhanh nhất.</p><p>Trường hợp quý khách gửi hàng về Kamarket.vn, thời gian bảo hành dự kiến trong vòng 21- 45 ngày tùy thuộc vào điều kiện sẵn có của linh kiện thay thế từ nhà sản xuất/lỗi sản phẩm (không tính thời gian vận chuyển đi và về). Đối với sản phẩm</p><p><strong>4. Kamarket.vn bảo hành bằng các hình thức nào?</strong></p><p>Sản phẩm tại Kamarket.vn sẽ được bảo hành bằng 1 trong 4 hình thức sau:</p><p>Hóa đơn: khách hàng mang theo hóa đơn trực tiếp hoặc hóa đơn giá trị gia tăng có thông tin của sản phẩm để được bảo hành.</p><p>Phiếu bảo hành: đi kèm theo sản phẩm, có đầy đủ thông tin về nơi bảo hành và điều kiện bảo hành.</p><p>Tem bảo hành: loại tem đặc biệt chỉ sử dụng một lần, được dán trực tiếp lên sản phẩm. Sản phẩm còn trong thời hạn bảo hành phải thỏa điều kiện tem còn nguyên vẹn và thời gian bảo hành phải trước ngày được viết trên tem.</p><p>Điện tử: là chế độ bảo hành sản phẩm trực tuyến thay thế cho phương pháp bảo hành thông thường bằng giấy hay thẻ bảo hành bằng cách: nhắn tin SMS kích hoạt, quét mã QR-Code từ tem nhãn, đăng ký trên website hoặc bằng ứng dụng bảo hành.</p><p><strong>5. Kamarket.vn có bảo hành quà tặng kèm sản phẩm không?</strong></p><p>Kamarket.vn rất tiếc hiện chưa hỗ trợ bảo hành quà tặng đi kèm sản phẩm chính.</p><p><strong>Lưu ý</strong>: Để đảm bảo quyền lợi khách hàng và Kamarket.vn có cơ sở làm việc với các bộ phận liên quan, tất cả yêu cầu bảo hành quý khách cần cung cấp hình ảnh/clip sản phẩm lỗi. Kamarket.vn xin phép từ chối khi chưa nhận đủ thông tin hình ảnh từ quý khách.</p><i>Chính sách sẽ được áp dụng và có hiệu lực từ ngày 01/01/2024.</i></div></div></div> */}
        </div>
      </WrapperComponent>
    </>
  )
}

export default GuaranteePolicy
