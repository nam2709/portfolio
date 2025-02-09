import { describe, it, expect, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../../../.env.${stage}`);
delete process.env.BASE_URL;
config({ path: envPath });

const baseURL = 'https://kbqgze06da.execute-api.ap-southeast-2.amazonaws.com/dev/'

describe('CASE TEST: LẤY THÔNG TIN CỦA CATEGORY', () => {
  // Admin create Category
  let CategoryId
  describe('Lấy thông tin của category vừa thêm mới', () => {
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

    it('Lấy thông tin của Category thành công', async () => {
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
  describe('Lấy thông tin của category con vừa thêm mới', () => {
    // Admin create an new Sub Category in database
    let SubcategoryId
    it('Admin thêm mới Category Con trả về statusCode 200 and thông báo thành công', async () => {
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

    it('Lấy thông tin của Category Con thành công', async () => {
      // GIVEN
      const id = SubcategoryId?.replace(/#SUB/g, '.');
      // WHEN
      const response = await fetch(`${baseURL}/category/${id}`, {
        method: 'GET'
      })
      const result = await response.json();
      // THEN
      expect(response.status).toBe(200)
      expect(result.name).toBe('HELLO WORLD')
    })
  })
})