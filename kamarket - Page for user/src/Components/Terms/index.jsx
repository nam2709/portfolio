'use client'
import { useContext, useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import './Terms.css'
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

const Terms = () => {
  const [data, setData] = useState(null)
  const param = useParams();
  const language = param.lng;
  console.log('language', language)

  useEffect(() => {
    const fetchData = async () => {
        const response = await PolicyGet({ action: 'TERMS', language: language });
        console.log('response', response)
        setData(response);
    };

    fetchData();
  }, [language]);

  return (
    <>
      <Breadcrumb title={'Terms'} subNavigation={[{ name: 'Terms' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'fresh-vegetable-section section-lg-space',
          row: 'gx-xl-5 gy-xl-0 g-3 ratio_148_1',
        }}
        customCol
      >
        <div
            key="terms-of-use"
            id="terms-of-use"
            className={`faq-section`}
        >
        <div class="container">
          <TextLimit value={data?.description} />
        {/* <div>
            <p className="text-center"><strong style={{
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontSize: '38px',
                        lineHeight: '120%',
                        marginBottom: '30px',
                        color: '#002b41'
                    }}>Điều khoản sử dụng</strong></p>
        </div>
        <div>
            <div class="ant-typography">
            Chào mừng quý khách đến mua sắm tại <b>Kamarket</b>. Sau khi truy cập vào website <b>Kamarket</b> để tham khảo hoặc mua sắm, quý khách đã đồng ý tuân thủ và ràng buộc với những quy định của <b>Kamarket</b>. Vui lòng xem kỹ các quy định và hợp tác với chúng tôi để xây dựng một website <b>Kamarket</b> ngày càng thân thiện và phục vụ tốt những yêu cầu của chính quý khách. Ngoài ra, nếu có bất cứ câu hỏi nào về những thỏa thuận trên đây, vui lòng email cho chúng tôi qua địa chỉ support@kamarket.vn.
            </div>
            <div class="ant-typography">
            <p>&nbsp;</p>
            <p><strong>Tài khoản của khách hàng</strong></p>
            <span class="ant-typography mb-3 d-block">
                Khi sử dụng dịch vụ <b>Kamarket</b>, quý khách sẽ cung cấp cho chúng tôi thông tin về địa chỉ email, mật khẩu và họ tên để có được một tài khoản tại đây. Việc sử dụng và bảo mật thông tin tài khoản là trách nhiệm và quyền lợi của quý khách khi sử dụng <b>Kamarket</b>. Ngoài ra, những thông tin khác trong tài khoản như địa chỉ giao hàng, số điện thoại là những thông tin sẽ giúp <b>Kamarket</b> phục vụ quý khách tốt nhất. Trong trường hợp thông tin do quý khách cung cấp không đầy đủ hoặc sai dẫn đến việc không thể giao hàng cho quý khách, chúng tôi có quyền đình chỉ hoặc từ chối phục vụ mà không phải chịu bất cứ trách nhiệm nào đối với quý khách. Khi có những thay đổi thông tin của quý khách, vui lòng cập nhật lại thông tin trong tài khoản tại <b>Kamarket</b>. Quý khách phải giữ kín mật khẩu và tài khoản, hoàn toàn chịu trách nhiệm đối với tất cả các hoạt động diễn ra thông qua việc sử dụng mật khẩu hoặc tài khoản của mình. Quý khách nên đảm bảo thoát khỏi tài khoản tại <b>Kamarket</b> sau mỗi lần sử dụng để bảo mật thông tin của mình.
            </span>
            </div>
            <div class="ant-typography">
            <p><strong>Quyền lợi bảo mật thông tin của khách hàng</strong></p>
            <span class="ant-typography mb-4 d-block">
                Khi sử dụng dịch vụ tại website <b>Kamarket</b>, quý khách được đảm bảo rằng những thông tin cung cấp cho chúng tôi sẽ chỉ được dùng để nâng cao chất lượng dịch vụ dành cho khách hàng của <b>Kamarket</b> và sẽ không được chuyển giao cho bên thứ ba nào khác vì mục đích thương mại. Thông tin của quý khách tại <b>Kamarket</b> sẽ được chúng tôi bảo mật và chỉ trong trường hợp pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.
            </span>
            </div>
            <div class="ant-typography">
            <p><strong>Trách nhiệm của khách hàng khi sử dụng dịch vụ của Kamarket</strong></p>
            <span class="ant-typography mb-4 d-block">
                Quý khách tuyệt đối không được sử dụng bất kỳ công cụ, phương pháp nào để can thiệp, xâm nhập bất hợp pháp vào hệ thống hay làm thay đổi cấu trúc dữ liệu tại website <b>Kamarket</b>. Quý khách không được có những hành động (thực hiện, cổ vũ) việc can thiệp, xâm nhập dữ liệu của <b>Kamarket</b> cũng như hệ thống máy chủ của chúng tôi. Ngoài ra, xin vui lòng thông báo cho quản trị web của <b>Kamarket</b> ngay khi quý khách phát hiện ra lỗi hệ thống theo email support@kamarket.vn.
                Quý khách không được đưa ra những nhận xét, đánh giá có ý xúc phạm, quấy rối, làm phiền hoặc có bất cứ hành vi nào thiếu văn hóa đối với người khác. Không nêu ra những nhận xét có tính chính trị (tuyên truyền, chống phá, xuyên tạc chính quyền), kỳ thị tôn giáo, giới tính, sắc tộc.... Tuyệt đối cấm mọi hành vi mạo nhận, cố ý tạo sự nhầm lẫn mình là một khách hàng khác hoặc là thành viên Ban Quản Trị <b>Kamarket</b>.
            </span>
            </div>
            <div class="ant-typography">
            <p><strong>Trách nhiệm và quyền lợi của Kamarket</strong></p>
            <span class="ant-typography mb-4 d-block">
                Trong trường hợp có những phát sinh ngoài ý muốn hoặc trách nhiệm của mình, <b>Kamarket</b> sẽ không chịu trách nhiệm về mọi tổn thất phát sinh. Ngoài ra, chúng tôi không cho phép các tổ chức, cá nhân khác quảng bá sản phẩm tại website <b>Kamarket</b> mà chưa có sự đồng ý bằng văn bản từ <b>Kamarket</b>. Các thỏa thuận và quy định trong Điều khoản sử dụng có thể thay đổi vào bất cứ lúc nào nhưng sẽ được <b>Kamarket</b> thông báo cụ thể trên website <b>Kamarket</b>.
            </span>
            </div>
        </div> */}
        </div>
        </div>
      </WrapperComponent>
    </>
  )
}

export default Terms
