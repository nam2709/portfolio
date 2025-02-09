import { describe, it, expect, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../../../.env.${stage}`);
delete process.env.BASE_URL;
config({ path: envPath });

const baseURL = 'https://kbqgze06da.execute-api.ap-southeast-2.amazonaws.com/dev/'

describe('CAST TEST: LIỆT KÊ SÁCH TRONG CATEGORY', () => {
    let CategoryId;
    
    // Admin creates a category
    describe('Admin tạo Category và sau đó thêm sách vào', () => {
      it('Admin tạo mới category trả về statusCode 200 and thông báo thành công', async () => {
        // GIVEN
        const payload = {
          "name": "Sách Tiếng Anh",
          "slug": "sach-tieng-anh",
          "description": "Sách Tiếng Anh Nhập Khẩu"
        };
  
        // WHEN
        const response = await fetch(`${baseURL}/categories`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          }
        });
        const result = await response.json();
        CategoryId = result.category.categoryId; // Set CategoryId here
  
        // THEN
        expect(response.status).toBe(200);
        expect(result.message).toBe('Category created');
        expect(result.category.name).toBe('Sách Tiếng Anh');
      });
  
      it('Thêm sách vào trong category thành công', async () => {
        // Ensure CategoryId has been set before making this request
        expect(CategoryId).toBeDefined(); // You can check if CategoryId is defined here
  
        // WHEN
        const response = await fetch(`${baseURL}/categories/${CategoryId}/books/9780231153683`, {
          method: 'POST'
        });
  
        // THEN
        expect(response.status).toBe(200);
      });
    });
  
    // List books added to the Category
    describe('Liệt kê sách vừa được thêm vào category', () => {
      it('Trả về danh sách books trong category', async () => {
        // Ensure CategoryId is set before making the request
        expect(CategoryId).toBeDefined();
  
        // WHEN
        const response = await fetch(`${baseURL}/categories/${CategoryId}/books`, {
          method: 'GET'
        });
        const result = await response.json();
        // console.log('CategoryId', CategoryId);
        // console.log('result list', result);
  
        // THEN
        expect(response.status).toBe(200);
        // Optionally, you can check that the result contains books or the expected format
        expect(result[0].bookId).toBe('9780231153683'); // Adjust this based on the actual response structure
      });
    });
  });
  