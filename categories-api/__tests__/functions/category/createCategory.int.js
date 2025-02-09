import { describe, it, expect, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../../../.env.${stage}`);
delete process.env.BASE_URL;
config({ path: envPath });

const baseURL = 'https://kbqgze06da.execute-api.ap-southeast-2.amazonaws.com/dev/'

describe('TEST CASE: TẠO MỚI CATEGORY', () => {
  // Admin create Category
  let CategoryId
  describe('Admin tạo mới category', () => {
    // Admin create an new Category in database
    it('Admin tạo mới category trả về statusCode 200 and thông báo thành công', async () => {
      // GIVEN
      const payload = {
        "name": "Sách Tiếng Anh",
        "slug": "sach-tieng-anh",
        "description": "Sách Tiếng Anh Nhập Khẩu"
      }

      // WHEN
      const response = await fetch(`${baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const result = await response.json();
      CategoryId = result.category.categoryId
      // THEN
      expect(response.status).toBe(200)
      expect(result.message).toBe('Category created')
      expect(result.category.name).toBe('Sách Tiếng Anh')
    })

    it('- Kiểm tra xem category vừa thêm mới đã thực sự có trong Dynamodb', async () => {
      // WHEN
      const response = await fetch(`${baseURL}/category/${CategoryId}`, {
        method: 'GET'
      })
      const result = await response.json();
      // console.log('result', result)
      // THEN
      expect(response.status).toBe(200)
      expect(result.name).toBe('Sách Tiếng Anh')
    })
  })
  // Admin create SubCategory
  describe('Admin thêm mới Category Con', () => {
    // Admin create an new Sub Category in database
    let SubcategoryId
    it('Admin thêm mới Category Con của Category Chính vừa được tạo', async () => {
      // GIVEN
      const payload = {
        "categoryId": CategoryId,
        "name": "HELLO WORLD",
        "slug": "hello-world",
        "description": "Sách HelloWorld"
      }

      // WHEN
      const response = await fetch(`${baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })
      // console.log('payload', payload)
      const result = await response.json();
      // console.log('result', result)
      SubcategoryId = result.category.categoryId
      // THEN
      expect(response.status).toBe(200)
      expect(result.message).toBe('Category created')
      expect(result.category.name).toBe('HELLO WORLD')
    })

    it('Admin thêm mới Category Con của Category Con vừa được tạo', async () => {
      // GIVEN
      const payload = {
        "categoryId": SubcategoryId,
        "name": "HELLO WORLD",
        "slug": "hello-world",
        "description": "Sách HelloWorld"
      }

      // WHEN
      const response = await fetch(`${baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })
      // console.log('payload', payload)
      const result = await response.json();
      // console.log('result', result)
      SubcategoryId = result.category.categoryId
      // THEN
      expect(response.status).toBe(200)
      expect(result.message).toBe('Category created')
      expect(result.category.name).toBe('HELLO WORLD')
    })

    it('Admin thêm mới Category Con thất bại khi categoryId ( Category Parrent ) truyền vào không tồn tại', async () => {
      // GIVEN
      const payload = {
        "categoryId": "NOTANID",
        "name": "HELLO WORLD",
        "slug": "hello-world",
        "description": "Sách HelloWorld"
      }

      // WHEN
      const response = await fetch(`${baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })

      let bodyJson
        if (!response.ok) {
            const bodyText = await response.text();
            bodyJson = JSON.parse(bodyText);
        }
      // console.log('bodyJson admin', bodyJson)
      // const result = await response.json();
      // THEN
      expect(response.status).toBe(500)
      expect(bodyJson.message).toBe('Parent category with ID NOTANID does not exist.')
    })

    it('Admin thêm mới Category Con thất bại khi thiếu tham số bắt buộc (vd: name)', async () => {
      // GIVEN
      const payload = {
        "categoryId": CategoryId,
        "slug": "hello-world",
        "description": "Sách HelloWorld"
      }

      // WHEN
      const response = await fetch(`${baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })

      let bodyJson
        if (!response.ok) {
            const bodyText = await response.text();
            bodyJson = JSON.parse(bodyText);
        }
      // console.log('bodyJson admin', bodyJson)

      // const result = await response.json();
      // THEN
      expect(response.status).toBe(400)
      expect(bodyJson.errors[0]).toBe('name is a required field')
    })

    it('Admin thêm mới Category Con thất bại khi tham số truyền vào không đúng định dạng (vd: name: 123)', async () => {
      // GIVEN
      const payload = {
        "categoryId": CategoryId,
        "name": 123123,
        "slug": "hello-world",
        "description": "Sách HelloWorld"
      }

      // WHEN
      const response = await fetch(`${baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })

      let bodyJson
        if (!response.ok) {
            const bodyText = await response.text();
            bodyJson = JSON.parse(bodyText);
        }
      // console.log('bodyJson admin', bodyJson)
      // const result = await response.json();
      // THEN
      expect(response.status).toBe(400)
      expect(bodyJson.errors[0]).toBe('name must be a `string` type, but the final value was: `123123`.')
    })

    it('Kiểm tra xem đã thực sự thêm mới Category Con trong DynammoDB hay chưa', async () => {
      // GIVEN
      const id = SubcategoryId?.replace(/#SUB/g, '.');
      // WHEN
      const response = await fetch(`${baseURL}/category/${id}`, {
        method: 'GET'
      })
      const result = await response.json();
      // console.log('result', result)
      // THEN
      expect(response.status).toBe(200)
      expect(result.name).toBe('HELLO WORLD')
    })
  })
})