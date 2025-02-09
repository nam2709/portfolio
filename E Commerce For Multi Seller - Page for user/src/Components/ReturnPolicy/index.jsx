'use client'
import { useContext, useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import WrapperComponent from '../Common/WrapperComponent'
import ThemeOptionContext from '@/Helper/ThemeOptionsContext'
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
        const response = await PolicyGet({ action: 'RETURNPOLICY', language: language });
        console.log('response', response)
        setData(response);
    };

    fetchData();
  }, [language]);

  return (
    <>
      <Breadcrumb title={'Return Policy'} subNavigation={[{ name: 'Return Policy' }]} />
      <WrapperComponent
        classes={{
          sectionClass: 'fresh-vegetable-section section-lg-space',
          row: 'gx-xl-5 gy-xl-0 g-3 ratio_148_1',
        }}
        customCol
      >
        <div
            key="return-policy"
            id="return-policy"
            className={`faq-section`}
        >
            <div class="container">
              <TextLimit value={data?.description} />
              {/* <div><p className="text-center"><strong style={{
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontSize: '38px',
                        lineHeight: '120%',
                        marginBottom: '30px',
                        color: '#002b41'
                    }}> Chính sách đổi trả</strong> </p><div><div class="return-policy-cost"><p>Chúng tôi luôn trân trọng sự tin tưởng và ủng hộ của quý khách hàng khi trải nghiệm mua hàng tại Kamarket.vn. Do đó chúng tôi luôn cố gắng hoàn thiện dịch vụ tốt nhất để phục vụ mọi nhu cầu mua sắm của quý khách.</p><p><strong> Kamarket.vn</strong> chúng tôi luôn luôn cam kết tất cả các sản phẩm bán tại<strong> Kamarket.vn</strong> 100% là những sản phẩm chất lượng và xuất xứ nguồn gốc rõ ràng, hợp pháp cũng như an toàn cho người tiêu dùng. Để việc mua sắm của quý khách tại<strong> Kamarket.vn</strong> là trải nghiệm dịch vụ thân thiện, chúng tôi hy vọng quý khách sẽ kiểm tra kỹ các nội dung sau trước khi nhận hàng:&nbsp;</p><ul><p>+ Thông tin sản phẩm: tên sản phẩm và chất lượng sản phẩm.</p><p>+ Số lượng sản phẩm.</p></ul><p>Trong trường hợp hiếm hoi sản phẩm quý khách nhận được có khiếm khuyết, hư hỏng hoặc không như mô tả, Kamarket.vn cam kết bảo vệ khách hàng bằng chính sách đổi trả/ hoàn tiền trên tinh thần bảo vệ quyền lợi người tiêu dùng nhằm cam kết với quý khách về chất lượng sản phẩm và dịch vụ của chúng tôi.</p><p>Khi quý khách hàng có hàng hóa mua tại Kamarket.vn cần đổi/ trả/bảo hành/hoàn tiền, xin quý khách hàng liên hệ với chúng tôi qua hotline<strong> 0896658585</strong> hoặc truy cập<strong> Kamarket.vn/vi/return-policy</strong> để tìm hiểu thêm về chính sách đổi/trả:</p><ol><p>Thời gian áp dụng đổi/trả</p></ol><div class="ant-image"><img style={{width: "100%"}} alt="chính sách đổi trả Kamarket" className="ant-image-img mt-0" src="https://kamarket-prod-storage.s3.ap-southeast-1.amazonaws.com/public/ka.png"/>
            {/* <div class="ant-image-mask"><div class="ant-image-mask-info"><span role="img" aria-label="eye" class="anticon anticon-eye"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></span>Preview</div></div> 
            </div><p>Quý khách vui lòng thông báo về cho Kamarket.vn ngay khi:</p><ul><p>+ Kiện hàng giao tới ngoại quan bên ngoài có dấu hiệu hư hại , sản phẩm bên trong trầy xước ,gãy bìa, rách, móp méo, ướt , bể vỡ...trong vòng 2 ngày kể từ khi nhận hàng thành công.</p><p>+ Sản phẩm giao tới bị sai hàng , giao thiếu hàng trong vòng 2 ngày kể từ khi nhận hàng thành công.</p><p>+ Sau khi Kamarket.vn xác nhận mail tiếp nhận yêu cầu kiểm tra xử lý, Kamarket.vn sẽ liên hệ đến quý khách để xác nhận thông tin hoặc nhờ bổ sung thông tin (nếu có). Trường hợp không liên hệ được Kamarket.vn rất tiếc xin được phép từ chối xử lý yêu cầu. Thời gian Kamarket.vn liên hệ trong giờ hành chính tối đa 3 lần trong vòng 7 ngày sau khi nhận thông tin yêu cầu.</p><p>+ Chúng tôi sẽ kiểm tra các trường hợp trên và giải quyết cho quý khách tối đa trong 30 ngày làm việc kể từ khi quý khách nhận được hàng, quá thời hạn trên rất tiếc chúng tôi không giải quyết khiếu nại.</p></ul><p>1: Các trường hợp yêu cầu đổi trả</p><ul><p>+ Lỗi kỹ thuật của sản phẩm - do nhà cung cấp (sách thiếu trang, sút gáy, trùng nội dung, sản phẩm điện tử, đồ chơi điện – điện tử không hoạt động..)</p><p>+ Giao nhầm/ giao thiếu (thiếu sản phẩm đã đặt, thiếu phụ kiện, thiếu quà tặng kèm theo)</p><p>+ Chất lượng hàng hóa kém, hư hại do vận chuyển.</p><p>+ Hình thức sản phẩm không giống mô tả ban đầu.</p><p>+ Quý khách đặt nhầm/ không còn nhu cầu (*)</p></ul><p>(*) Đối với các Sản phẩm không bị lỗi, chỉ áp dụng khi sản phẩm đáp ứng đủ điều kiện sau:</p><p>Quý khách&nbsp;có thể trả lại sản phẩm đã mua tại&nbsp; Kamarket.vn trong vòng 30 ngày kể từ khi nhận hàng với đa số sản phẩm khi thỏa mãn các điều kiện sau:</p><ul><p>+ Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của nhà sản xuất.</p><p>+ Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).</p><p>+ Nếu là sản phẩm điện – điện tử thì chưa bị kích hoạt, chưa có sao ghi dữ liệu vào thiết bị.</p></ul><p><strong> 2: Điều kiện đổi trả</strong> </p><p>Kamarket.vn hỗ trợ đổi/ trả sản phẩm cho quý khách nếu:</p><ul><p>+ Sản phẩm còn nguyên bao bì như hiện trạng ban đầu.</p><p>+ Sản phầm còn đầy đủ phụ kiện, quà tặng khuyến mãi kèm theo.</p><p>+ Hóa đơn GTGT (nếu có).</p><p>+ Cung cấp đầy đủ thông tin đối chứng theo yêu cầu (điều 4).</p></ul><p><strong> 3: Quy trình đổi trả</strong> </p><ul><p>Quý khách vui lòng thông tin đơn hàng cần hỗ trợ đổi trả theo Hotline 083227685 hoặc email về địa chỉ: hi@Kamarket.vn với tiêu đề<strong> “Đổi Trả Đơn Hàng " Mã đơn hàng".</strong> </p><p><span>Quý khách cần cung cấp đính kèm thêm các bằng chứng để đối chiếu/ khiếu nại sau:</span></p></ul><p>+ Video clip quay rõ các mặt của kiện hàng trước khi khui để thể hiện tình trạng của kiện hàng.</p><p>+ Video clip mở kiện hàng từ lúc bắt đầu khui ngoại quan đến kiểm tra sản phẩm bên trong thùng hàng.</p><p>+ Video quay rõ nét , không mờ , nhoè, thể hiện đầy đủ thông tin mã đơn hàng và quay cận cảnh lỗi của sản phẩm.</p><p>+ Hình chụp tem kiện hàng có thể hiện mã đơn hàng.</p><p>+ Hình chụp tình trạng ngoại quan (băng keo, seal, hình dạng thùng hàng, bao bì), đặc biệt các vị trí nghi ngờ có tác động đến sản phẩm (móp méo, ướt, rách...)</p><p>+ Hình chụp tình trạng sản phẩm bên trong, nêu rõ lỗi kỹ thuật nếu có.</p><ul><p>Để đảm bảo quyền lợi khách hàng và để Kamarket.vn có cơ sở làm việc với các bộ phận liên quan, tất cả yêu cầu đổi/ trả/ bảo hành quý khách cần cung cấp hình ảnh/ clip sản phẩm lỗi. Quá thời gian đổi/ trả sản phẩm nếu chưa nhận được đủ hình ảnh/ clip từ quý khách, Kamarket.vn xin phép từ chối hỗ trợ.</p></ul><div class="ant-image"><img style={{width: "100%"}} alt="chính sách đổi trả Kamarket" class="ant-image-img mt-0" src="https://kamarket-prod-storage.s3.ap-southeast-1.amazonaws.com/kamarket1.png"/>
            {/* <div class="ant-image-mask"><div class="ant-image-mask-info"><span role="img" aria-label="eye" class="anticon anticon-eye"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></span>Preview</div></div> 
            </div><p><strong> 4: Cách thức chuyển sản phẩm đổi trả về Kamarket.vn</strong> </p><ul><p>Khi yêu cầu đổi trả được giải quyết, quý khách vui lòng đóng gói sản phẩm như hiện trạng khi nhận hàng ban đầu (bao gồm sản phẩm, quà tặng, phụ kiện kèm theo sản phẩm,…nếu có).</p><p>Hóa đơn giá trị gia tăng của<strong> Kamarket.vn</strong> (nếu có).</p><p>Phụ kiện đi kèm sản phẩm và quà tặng khuyến mãi kèm theo (nếu có).</p><p>Quý khách cần quay video clip đóng gói sản phẩm để làm bằng chứng đối chiếu/ khiếu nại liên quan đến đổi trả về sau (nếu cần).</p><p>Quý khách vui lòng chịu trách nhiệm về trạng thái nguyên vẹn của sản phẩm khi gửi về<strong> Kamarket.vn</strong> </p><p>Sau khi nhận được sản phẩm quý khách gởi về,<strong> Kamarket.vn</strong> sẽ phản hồi và cập nhật thông tin trên từng giai đoạn xử lý đến quý khách qua điện thoại/email .</p></ul><p><strong> Lưu ý khác:</strong> </p><p>(*) Các sản phẩm thuộc danh mục GIẢM GIÁ/SALE sẽ không được áp dụng chính sách đổi trả của<strong> Kamarket.vn.</strong> </p><p>(*) Nếu quý khách hủy đơn hàng cũ, đã thanh toán thành công, mà không có nhu cầu đặt lại đơn hàng khác, hoặc quý khách yêu cầu trả hàng hoàn tiền → chúng tôi sẽ hoàn tiền lại cho quý khách qua hình thức thanh toán ban đầu, đối với các đơn hàng quý khách thanh toán bằng tiền mặt sẽ được hoàn qua tài khoản Ngân hàng do quý khách chỉ định</p><p>Thời gian hoàn tiền được quy định tại Điều 6.</p><p>(*) Không áp dụng đổi / trả / hoàn tiền đối với mặt hàng Chăm Sóc Cá Nhân và các Đơn Hàng Bán Sỉ.</p><p><strong> 5: Thời gian hoàn tiền</strong> </p><ul><p>Đối với những đơn hàng thanh toán trả trước: sau khi cập nhật hủy, thời gian hoàn tiền sẽ tùy thuộc vào phương thức thanh toán. Quý khách vui lòng tham khảo thời gian hoàn tiền như sau:</p></ul><div class="ant-image"><img alt="chính sách đổi trả Kamarket" class="ant-image-img mt-0" src="https://kamarket-prod-storage.s3.ap-southeast-1.amazonaws.com/public/ka2.png"/>
            {/* <div class="ant-image-mask"><div class="ant-image-mask-info"><span role="img" aria-label="eye" class="anticon anticon-eye"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></span>Preview</div></div> 
            </div><p>(*) Lưu ý:</p><ul><p>+ Ngày làm việc không bao gồm thứ 7, chủ nhật và ngày lễ.</p><p>+ Đối với những đơn hàng trả hàng hoàn tiền:</p><p>+ Thời gian hoàn tiền được bắt đầu tính kể từ thời điểm Kamarket.vn nhận được hàng hoàn trả và xác nhận với quý khách về việc hàng hoàn trả đáp ứng các điều kiện trả hàng được quy định tại chính sách này. Thời gian hoàn tiền tuân thủ theo quy định tại Mục 6 này.</p><p>+ Đối với các đơn hàng hoàn tiền, hình thức thanh toán của quý khách là tiền mặt (COD): Kamarket.vn sẽ hoàn tiền qua tài khoản Ngân hàng do quý khách chỉ định.</p></ul><p>Trong trường hợp đã quá thời gian trên quý khách chưa nhận được tiền hoàn, vui lòng liên hệ ngân hàng phát hành thẻ hoặc liên hệ bộ phận Chăm sóc khách hàng của Kamarket.vn</p><p><strong> Nếu cần hỗ trợ thêm bất kì thông tin nào, Kamarket nhờ quý khách liên hệ trực tiếp qua hotline 0896658585 để được hỗ trợ nhanh chóng.</strong> </p><ul><p><em>Chính sách sẽ được áp dụng và có hiệu lực từ ngày 01/01/2024.</em></p></ul></div></div></div>
             */}
             </div>
        </div>
      </WrapperComponent>
    </>
  )
}

export default Terms
