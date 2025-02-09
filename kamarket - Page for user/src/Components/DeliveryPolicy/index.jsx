'use client'
import { useContext, useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
import './DeliveryPolicy.css'
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

const DeliveryPolicy = () => {
  const [data, setData] = useState(null)
  const param = useParams();
  const language = param.lng;
  console.log('language', language)

  useEffect(() => {
    const fetchData = async () => {
        const response = await PolicyGet({ action: 'DELIVERYPOLICY', language: language });
        console.log('response', response)
        setData(response);
    };

    fetchData();
  }, [language]);

  return (
    <>
      <Breadcrumb title={'Delivery Policy'} subNavigation={[{ name: 'Delivery Policy' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'fresh-vegetable-section section-lg-space',
          row: 'gx-xl-5 gy-xl-0 g-3 ratio_148_1',
        }}
        customCol
      >
        <div
        key="delivery-policy"
        id="delivery-policy"
        className={`faq-section`}
        >
          <TextLimit value={data?.description} />
        {/* <div class="container">
            <div>
            <p className="text-center"><strong style={{
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontSize: '38px',
                        lineHeight: '120%',
                        marginBottom: '30px',
                        color: '#002b41'
                    }}>CHÍNH SÁCH VẬN CHUYỂN/ĐÓNG GÓI</strong></p>
            </div>
            <div>
            <div class="policies-shipping-cost">
                <p><strong>Áp dụng cho toàn bộ đơn hàng của Quý Khách tại Kamarket.vn</strong></p>
                <p><strong>Chính sách vận chuyển:</strong></p>
                <p><strong>Kamarket.vn</strong> cung cấp dịch vụ giao hàng toàn quốc, gửi hàng tận nơi đến địa chỉ cung cấp của Quý khách. Thời gian giao hàng dự kiến phụ thuộc vào kho có hàng và địa chỉ nhận hàng của Quý khách.</p>
                <p>Với đa phần đơn hàng, <strong>Kamarket.vn</strong> cần vài giờ làm việc để kiểm tra thông tin và đóng gói hàng. Nếu các sản phẩm đều có sẵn hàng, <strong>Kamarket.vn</strong> sẽ nhanh chóng bàn giao cho đối tác vận chuyển. Nếu đơn hàng có sản phẩm sắp phát hành, <strong>Kamarket.vn</strong> sẽ ưu tiên giao những sản phẩm có hàng trước cho Quý khách hàng.</p>
                <p><strong>Bảng thời gian dự kiến như sau:</strong></p>
                <div class="ant-image">
                <img alt="chính sách vận chuyển Kamarket" class="ant-image-img mt-0" src="https://firebasestorage.googleapis.com/v0/b/bookee-store-prod-c3f0d.appspot.com/o/image%2F4.PNG?alt=media&amp;token=196f02e4-321e-4b6f-bc12-95159f360087"/>
                {/* <div class="ant-image-mask">
                    <div class="ant-image-mask-info">
                    <span role="img" aria-label="eye" class="anticon anticon-eye">
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                        </svg>
                    </span>
                    Preview
                    </div>
                </div>
                </div>
                <p><strong><em>*Lưu ý:</em></strong></p>
                
                <li><em>Trong một số trường hợp, hàng nằm không có sẵn tại kho gần nhất, thời gian giao hàng có thể chậm hơn so với dự kiến do điều hàng. Các phí vận chuyển phát sinh, Kamarket.vn</em><em> sẽ hỗ trợ hoàn toàn.</em></li>
                <li><em>Ngày làm việc là từ thứ hai đến thứ sau, không tính thứ bảy, chủ nhật và ngày nghỉ lễ, tết, nghỉ bù, và không bao gồm các tuyến huyện đảo xa.</em></li>
                
                <p><strong>Bảng giá dịch vụ vận chuyển hàng hóa:</strong></p>
                <div class="ant-image">
                <img alt="chính sách vận chuyển Kamarket" class="ant-image-img mt-0" src="https://firebasestorage.googleapis.com/v0/b/bookee-store-prod-c3f0d.appspot.com/o/image%2F5.PNG?alt=media&amp;token=cfaef52c-3f7a-4e50-81de-7eb75f262c93"/>
                {/* <div class="ant-image-mask">
                    <div class="ant-image-mask-info">
                    <span role="img" aria-label="eye" class="anticon anticon-eye">
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                        </svg>
                    </span>
                    Preview
                    </div>
                </div>
                </div>
                <p>Chính sách này có hiệu lực vào ngày 01 tháng 01 năm 2024.</p>
                <p><strong>Một số lưu ý khi nhận hàng:</strong></p>
                
                <p>+ Trước khi tiến hành giao hàng cho Quý khách, bưu tá của Đối tác vận chuyển sẽ liên hệ qua số điện thoại của Quý khách trước khoảng 3 đến 5 phút để xác nhận giao hàng.</p>
                <p>+ Nếu Quý khách không thể có mặt trong đợt nhận hàng thứ nhất, <strong>Kamarket.vn</strong> sẽ cố gắng liên lạc lại thêm ít nhất 2 lần nữa (trong 02 ca giao hàng khác nhau) để sắp xếp thời gian giao hàng, Quý khách vui lòng để ý điện thoại để liên hệ được với bưu tá giao hàng.</p>
                <p>+ Nếu qua 3 lần liên hệ giao hàng, <strong>Kamarket.vn</strong> vẫn không thể liên lạc được với Quý khách để giao hàng, <strong>Kamarket.vn</strong> sẽ thông báo cho Quý khách về việc hủy đơn hàng. Trong trường hợp Quý khách đã thanh toán trước cho đơn hàng, Quý khách sẽ nhận lại tiền vào tài khoản trong vòng 5 - 7 ngày làm việc, phụ thuộc vào tiến độ xử lý của ngân hàng. Số tiền Quý khách nhận lại sẽ trừ lại chi phí vận chuyển phát sinh từ việc giao hàng nhưng Quý khách không nhận hàng.</p>
                <p>+ Trong trường hợp Quý khách không đồng ý nhận hàng với xuất phát nguyên nhân từ hàng hóa của <strong>Kamarket.vn</strong> không đảm bảo, không đúng như mô tả, giao trễ so với cam kết,... Đơn hàng của Quý khách sẽ được hoàn lại cho chúng tôi và được hủy trên hệ thống <strong>Kamarket.vn</strong>. Nếu Quý khách đã thanh toán trước cho đơn hàng, Quý khách sẽ nhận lại tiền vào tài khoản trong vòng 5 - 7 ngày làm việc, phụ thuộc vào tiến độ xử lý của ngân hàng. Số tiền Quý khách nhận lại sẽ là toàn bộ số tiền đã thanh toán cho đơn hàng (bao gồm phí vận chuyển).</p>
                <p>+ Trong trường hợp đơn hàng đang giao đến Quý khách có ngoại quan bên ngoài hộp hàng hóa có dấu hiệu bị rách, móp, ướt, thủng, mất niêm phong,…Quý khách vui lòng kiểm tra kỹ chất lượng sản phẩm bên trong trước khi nhận hàng. Quý khách hoàn toàn có quyền từ chối nhận hàng và báo về cho chúng tôi qua hotline 0896658585 để được hỗ trợ giao lại đơn hàng mới hoặc hủy đơn hàng, hoàn tiền.</p>
                <p>+ Trong trường hợp Quý khách không có nhu cầu nhận hàng, Quý khách có thể báo với bên vận chuyển và/hoặc CSKH (qua Hotline 0896658585) về việc này. Đơn hàng của Quý khách sẽ được hoàn lại cho chúng tôi và được hủy trên hệ thống. Trong trường hợp Quý khách đã thanh toán trước cho đơn hàng, Quý khách sẽ nhận lại tiền vào tài khoản trong vòng 5 - 7 ngày làm việc, phụ thuộc vào tiến độ xử lý của ngân hàng. Số tiền Quý khách nhận lại sẽ trừ lại chi phí vận chuyển phát sinh từ việc giao hàng nhưng Quý khách không nhận.</p>
                <p>+ Kamarket.vn sẽ thông báo ngay đến Quý khách nếu có sự chậm chễ về thời gian giao hàng so với thời gian dự kiến ở trên. Trong phạm vi pháp luật cho phép, chúng tôi sẽ không chịu trách nhiệm cho bất cứ tổn thất nào, các khoản nợ, thiệt hại hoặc chi phí phát sinh từ việc giao hàng trễ. Trường hợp phát sinh chậm trễ trong việc giao hàng, nếu Quý khách không còn nhu cầu nhận hàng, Kamarket.vn cam kết sẽ hỗ trợ Quý khách hủy đơn hàng, nếu Quý khách đã thanh toán trước cho đơn hàng, Quý khách sẽ nhận lại tiền vào tài khoản trong vòng 5 - 7 ngày làm việc, phụ thuộc vào tiến độ xử lý của ngân hàng. Số tiền Quý khách nhận lại sẽ là toàn bộ số tiền đã thanh toán cho đơn hàng (bao gồm phí vận chuyển).</p>
                <p>+ Sản phẩm được đóng gói theo tiêu chuẩn đóng gói của Kamarket.vn, nếu Quý khách có nhu cầu đóng gói đặc biệt khác, vui lòng báo trước cho chúng tôi khi đặt hàng hàng và cho phép chúng tôi được tính thêm phí cho nhu cầu đặc biệt này.</p>
                <p>+ Mọi thông tin về việc thay đổi sản phẩm hay hủy bỏ đơn hàng, đề nghị Quý khách thông báo sớm để Kamarket.vn có thể điều chỉnh lại đơn hàng. Quý khách có thể liên hệ với chúng tôi qua số điện thoại hotline: 0896658585 hoặc qua địa chỉ email support@kamarket.vn</p>
                
                <p><strong>Tra cứu thông tin vận chuyển đơn hàng:</strong></p>
                <p>Kamarket.vn sử dụng dịch vụ giao hàng của các Đối tác vận chuyển để thực hiện giao đơn hàng đến Quý khách.</p>
                <p>Quý khách hoàn toàn có thể tự tra cứu thông tin lộ trình vận chuyển Đơn hàng bằng 02 cách sau đây:</p>
                
                <p>+ Quý khách tự truy cập trang web tra cứu thông tin của các Đối tác vận chuyển, nhập mã vận đơn để tiến hành tra cứu.</p>
                <p>+ Quý khách liên hệ với bộ phận chăm sóc khách hàng của Kamarket.vn qua hotline 0896658585 để được hỗ trợ tra cứu tình hình vận chuyển đơn hàng.</p>
                
                <p>Kamarket.vn cung cấp địa chỉ website của các Đối tác vận chuyển để Quý khách tra cứu tình hình vận chuyển đơn hàng:</p>
                
                <p><strong>+ Công ty Cổ Phần dịch vụ Giao hàng nhanh</strong></p>
                <p><strong>+ Công Ty TNHH Nin Sing Logistics (NINJA VAN)</strong></p>
                
                <p><em>Chính sách sẽ được áp dụng và có hiệu lực từ ngày 01/01/2024.</em></p>
            </div>
            </div>
        </div> */}
        </div>
      </WrapperComponent>
    </>
  )
}

export default DeliveryPolicy
