# DEV
https://wps8gci9mi.execute-api.ap-southeast-2.amazonaws.com/dev

# PROD


# NGƯỜI DÙNG BÌNH THƯỜNG/NGƯỜI MUA HÀNG

## AUTH
Sử dụng API của Amplify V6 để đăng ký và đăng nhập.

Khi gọi các API cá nhân (cần đăng nhập) thì cần sử dụng
{
    headers:
        Authorization: `Bearer ${accessToken}`
}

<details>
<summary>[USER] ĐĂNG KÝ TRỞ THÀNH VENDOR</summary>

```JSON
POST /vendors
INPUT
{
    "Name": "Bookee Store",
    "Slug": "bookee.store",
    "Description": "Kho sách ngoại văn lớn nhất Việt Nam"
}
```
</details>

<details>
<summary>[USER] THÊM VÀO GIỎ HÀNG</summary>

```JSON
POST /carts
INPUT
{
    "productId": "15STUZW8",
    "vendorId": "991e7438-f0b1-706f-fa1a-281f44624401",
    "quantity": "1",
    "price": "349000"
}

OUTPUT
{
    "quantity": 2,
    "updatedAt": "2024-06-07T02:15:16.052Z",
    "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "SK": "PRODUCT#15STUZW8",
    "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "price": 349000,
    "productId": "15STUZW8"
}
```
</details>

<details>
<summary>[USER] DANH SÁCH GIỎ HÀNG CÁ NHÂN</summary>

```JSON
INPUT
GET /carts

OUTPUT
[
    {
        "productId": "15STUZW8",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "price": 349000,
        "quantity": 10,
        "status": "APPROVED",
        "createdAt": "2024-06-05T09:52:40.967Z",
        "vendorId": "991e7438-f0b1-706f-fa1a-281f44624401",
        "GSI1SK": "PRODUCT#15STUZW8",
        "reviewedAt": "2024-06-05T09:52:54.889Z",
        "name": "Easy to Love, Difficult to Discipline: The 7 Basic Skills for Turning Conflict into Cooperation",
        "EntityType": "PRODUCT",
        "GSI2SK": "2024-06-05T09:52:40.967Z",
        "GSI2PK": "STATUS#APPROVED",
        "GSI1PK": "VENDOR#991e7438-f0b1-706f-fa1a-281f44624401",
        "isActive": true,
        "imageUrl": "https://images.isbndb.com/covers/77/51/9780060007751.jpg",
        "SK": "PRODUCT#15STUZW8",
        "PK": "PRODUCT#15STUZW8",
        "description": " Tập trung vào việc phát triển kỹ năng thay vì chỉ ra lỗi của trẻ em: Cuốn sách nàykhông chỉ tập trung vào việc chỉ ra lỗi của trẻ em, mà thay vào đó, tác giả cung cấp các kỹ năng cần thiết để giúp trẻ em học cách hợp tác và giải quyết xung đột một cách tích cực. Việc tập trung vào phát triển kỹ năng này sẽ giúp người đọc có thể xử lý tình huống hiệu quả và giúp trẻ em trở nên độc lập và tự tin hơn."
    }
]
```
</details>

<details>
<summary>[USER] BỎ SẢN PHẨM KHỎI GIỎ HÀNG</summary>

```JSON
DELETE /carts/{productId}
```
</details>

<details></details>
<summary>[USER] Cập nhật giỏ hàng</summary>

```JSON
PUT /carts

INPUT
{
    "productId": "15STUZW8",
    "quantity": 5
}

OUTPUT
{
    "quantity": 5,
    "updatedAt": "2024-06-07T02:51:53.646Z",
    "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "SK": "PRODUCT#15STUZW8",
    "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "price": 349000,
    "productId": "15STUZW8"
}
```

<details>
<summary>[USER] CHECKOUT / MUA HÀNG</summary>

```JSON
POST /carts/checkout

OUTPUT:
{
    "order": "15SXKGCU"
}

V1:
Khi checkout là mua toàn bộ sản phẩm trong giỏ hàng
Chỉ hỗ trợ thanh toán COD
```
</details>

<details>
<summary>[USER] DANH SÁCH ĐƠN HÀNG CỦA CÁ NHÂN</summary>

```JSON
GET /orders
QUERY PARAMS
status

OUTPUT
[
    {
        "orderStatus": "PENDING",
        "orderId": "15SXKGCU",
        "createdAt": "2024-06-07T02:29:01.273Z",
        "GSI1SK": "ORDER#15SXKGCU",
        "GSI3SK": "2024-06-07T02:29:01.273Z",
        "EntityType": "ORDER",
        "GSI2SK": "2024-06-07T02:29:01.273Z",
        "GSI2PK": "VENDOR#undefined",
        "GSI1PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "GSI4SK": "2024-06-07T02:29:01.273Z",
        "GSI4PK": "PAYMENT#CASH_ON_DELIVERY",
        "GSI3PK": "STATUS#PENDING",
        "paymentStatus": "CASH_ON_DELIVERY",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "amount": 349000,
        "SK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "PK": "ORDER#15SXKGCU"
    }
]
```
</details>

<details>
<summary>[USER] CHI TIẾT ĐƠN HÀNG</summary>

```JSON
GET /orders/{orderId}

OUTPUT
{
    "orderStatus": "PENDING",
    "orderId": "15SXKGCU",
    "createdAt": "2024-06-07T02:29:01.273Z",
    "GSI1SK": "ORDER#15SXKGCU",
    "GSI3SK": "2024-06-07T02:29:01.273Z",
    "EntityType": "ORDER",
    "GSI2SK": "2024-06-07T02:29:01.273Z",
    "GSI2PK": "VENDOR#undefined",
    "GSI1PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "GSI4SK": "2024-06-07T02:29:01.273Z",
    "GSI4PK": "PAYMENT#CASH_ON_DELIVERY",
    "GSI3PK": "STATUS#PENDING",
    "paymentStatus": "CASH_ON_DELIVERY",
    "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "amount": 349000,
    "SK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "PK": "ORDER#15SXKGCU"
}

```
</details>

## [USER] TÀI KHOẢN CÁ NHÂN - ĐỊA CHỈ
<details>
<summary>[USER] - THÊM ĐỊA CHỈ

```JSON
POST /address

INPUT
{
    "title": "Nhà",
    "name": "Khánh",
    "phone": "0917230586",
    "street": "C2503 - Mulberry",
    "ward": "Phường Mỗ Lao",
    "district": "Quận Hà Đông",
    "city": "Hà Nội"
}
OUTPUT
```
</details>

<details>
<summary>[USER] - DANH SÁCH ĐỊA CHỈ</summary>

```JSON
GET /address

OUTPUT
[
    {
        "addressId": "15RW2QYL",
        "createdAt": "2024-05-21T22:40:20.404Z",
        "country": "Vietnam",
        "name": "Khánh",
        "EntityType": "ADDRESS",
        "city": "Hà Nội",
        "district": "Quận Hà Đông",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "ward": "Phường Mỗ Lao",
        "SK": "ADDRESS#15RW2QYL",
        "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "phone": "0917230586",
        "title": "Văn Phòng",
        "street": "Hoàng Thành"
    },
    {
        "addressId": "15RW2UE5",
        "createdAt": "2024-05-21T22:42:17.697Z",
        "country": "Vietnam",
        "name": "Khánh",
        "EntityType": "ADDRESS",
        "city": "Hà Nội",
        "district": "Quận Hà Đông",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "ward": "Phường Mỗ Lao",
        "SK": "ADDRESS#15RW2UE5",
        "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "phone": "0917230586",
        "title": "Nhà",
        "street": "C2503 - Mulberry"
    },
    {
        "addressId": "15SXMK5Q",
        "createdAt": "2024-06-07T03:09:42.822Z",
        "country": "Vietnam",
        "name": "Khánh",
        "EntityType": "ADDRESS",
        "city": "Hà Nội",
        "district": "Quận Hà Đông",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "ward": "Phường Mỗ Lao",
        "SK": "ADDRESS#15SXMK5Q",
        "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "phone": "0917230586",
        "title": "Nhà",
        "street": "C2503 - Mulberry"
    }
]
```
</details>

<details>
<summary>[USER] - XOÁ ĐỊA CHỈ</summary>

```JSON
DELETE /address/{orderId}
```
</details>

<details>
<summary>[USER] - CẬP NHẬT ĐỊA CHỈ</summary>

```JSON
PUT /address/{addressId}

INPUT
{
    "title": "Nhà",
    "name": "Khánh",
    "phone": "0917230586",
    "street": "C2503 - Mulberry",
    "ward": "Phường Mỗ Lao",
    "district": "Quận Hà Đông",
    "city": "Hà Nội"
}

```
</details>

<details>
<summary>[USER] - THÔNG TIN CÁ NHÂN</summary>

```JSON
GET /me

OUTPUT
{
    "username": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
    "email": "khanhtt101+1@gmail.com",
    "email_verified": "true",
    "phone_number": "+84917230586",
    "phone_number_verified": "false",
    "name": "Khanh Tong",
    "address": "15RW2QYL",
    "addressDetail": {
        "addressId": "15RW2QYL",
        "createdAt": "2024-05-21T22:40:20.404Z",
        "country": "Vietnam",
        "name": "Khánh",
        "EntityType": "ADDRESS",
        "city": "Hà Nội",
        "district": "Quận Hà Đông",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "ward": "Phường Mỗ Lao",
        "SK": "ADDRESS#15RW2QYL",
        "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "phone": "0917230586",
        "title": "Văn Phòng",
        "street": "Hoàng Thành"
    }
}
```
</details>

<details>
<summary>[USER] - Cập nhật thông tin cá nhân</summary>

```JSON
PUT /me

{
    "name": "Khanh",
    "phone_number": "+84917230586", // hiện sửa phone đang bị lỗi. Tạm thời nên bỏ qua
    "address": "15RW2QYL", // đây là addressId được sử dụng làm mặc định.
    "email": "khanhtt101+1@gmail.com"
}
```
</details>

# [PUBLIC] SẢN PHẨM
<details>
<summary>[PUBLIC] - DANH SÁCH SẢN PHẨM</summary>

```JSON
GET /products

OUTPUT
[
    {
        "quantity": 10,
        "status": "APPROVED",
        "createdAt": "2024-06-05T09:52:40.967Z",
        "vendorId": "991e7438-f0b1-706f-fa1a-281f44624401",
        "vendor": {}, // sẽ thêm thông tin vendor
        "GSI1SK": "PRODUCT#15STUZW8",
        "reviewedAt": "2024-06-05T09:52:54.889Z",
        "name": "Easy to Love, Difficult to Discipline: The 7 Basic Skills for Turning Conflict into Cooperation",
        "EntityType": "PRODUCT",
        "GSI2SK": "2024-06-05T09:52:40.967Z",
        "GSI2PK": "STATUS#APPROVED",
        "GSI1PK": "VENDOR#991e7438-f0b1-706f-fa1a-281f44624401",
        "isActive": true,
        "imageUrl": "https://images.isbndb.com/covers/77/51/9780060007751.jpg",
        "SK": "PRODUCT#15STUZW8",
        "description": " Tập trung vào việc phát triển kỹ năng thay vì chỉ ra lỗi của trẻ em: Cuốn sách nàykhông chỉ tập trung vào việc chỉ ra lỗi của trẻ em, mà thay vào đó, tác giả cung cấp các kỹ năng cần thiết để giúp trẻ em học cách hợp tác và giải quyết xung đột một cách tích cực. Việc tập trung vào phát triển kỹ năng này sẽ giúp người đọc có thể xử lý tình huống hiệu quả và giúp trẻ em trở nên độc lập và tự tin hơn.",
        "price": 349000,
        "PK": "PRODUCT#15STUZW8",
        "productId": "15STUZW8"
    }
]
```
</details>

<details>
<summary>[USER] Wishlist</summary>

```JSON
POST /wishlist
INPUT
{
    "productId": "15STUZW8"
}

</details>

<details>
<summary>[USER] - My Wishlist</summary>

```JSON
GET /wishlist

OUTPUT
[
    {
        "SK": "PRODUCT#15STUZW8",
        "PK": "USER#398e3488-a0a1-70ed-0caf-de4fde48bac3",
        "productId": "15STUZW8",
        "userId": "398e3488-a0a1-70ed-0caf-de4fde48bac3"
    }
]
```
</details>

# [USER] REVIEW