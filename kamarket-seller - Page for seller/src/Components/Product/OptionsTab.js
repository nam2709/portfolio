import CheckBoxField from "../InputFields/CheckBoxField";

const OptionsTab = () => {
  return (
    <>
      <CheckBoxField name="is_featured" title="Featured" helpertext="*Kích hoạt tùy chọn này sẽ hiển thị một nhãn Nổi bật trên sản phẩm." />
      <CheckBoxField name="safe_checkout" title="SafeCheckout" helpertext="*Một hình ảnh thanh toán an toàn sẽ hiển thị trên trang sản phẩm" />
      <CheckBoxField name="secure_checkout" title="SecureCheckout" helpertext="*Một hình ảnh thanh toán bảo mật sẽ hiển thị trên trang sản phẩm." />
      <CheckBoxField name="social_share" title="SocialShare" helpertext="*Bật tùy chọn này để cho phép người dùng chia sẻ sản phẩm trên các nền tảng mạng xã hội." />
      {/* <CheckBoxField name="encourage_order" title="EncourageOrder" helpertext="*A random order count between 1 and 100 will be displayed to motivate user purchases." /> */}
      <CheckBoxField name="encourage_view" title="EncourageView" helpertext="*Tính năng này khuyến khích người dùng xem sản phẩm bằng cách hiển thị nội dung hoặc lời nhắc hấp dẫn." />
      <CheckBoxField name="is_trending" title="Trending" helpertext="*Kích hoạt để sản phẩm lên xu hướng" />
      <CheckBoxField name="is_return" title="Return" helpertext="*Kích hoạt để sản phẩm đủ điều kiện để được trả lại." />
      {/* <CheckBoxField name="status" helpertext="*Chuyển đổi giữa Bật và Tắt để kiểm soát sẵn có của sản phẩm để mua hàng." /> */}
    </>
  );
};

export default OptionsTab;
