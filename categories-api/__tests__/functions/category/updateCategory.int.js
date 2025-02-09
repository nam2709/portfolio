import { describe, it, expect, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../../../.env.${stage}`);
delete process.env.BASE_URL;
config({ path: envPath });

const baseURL = 'https://kbqgze06da.execute-api.ap-southeast-2.amazonaws.com/dev/'

describe('TEST CASE: CẬP NHẬP CATEGORY', () => {
  // Admin create Category
  let CategoryId
  describe('Admin tạo mới Category và cập nhập thông tin của Category đấy dựa trên CategoryId', () => {
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

    it('Admin cập nhập thành công những thông tin có trong Category (vd: name, description,..)', async () => {
      // GIVEN
      const payload = {
        "name": "Sách English",
        "slug": "sach english",
        "description": "Sách Tiếng Anh Nhập Khẩu"
      }

      // WHEN
      const response = await fetch(`${baseURL}/category/${CategoryId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const result = await response.json();
      // console.log('result', result)
      // THEN
      expect(response.status).toBe(200)
      expect(result.name).toBe('Sách English')
    })
  })
})