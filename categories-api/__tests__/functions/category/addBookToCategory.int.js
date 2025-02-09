import { describe, it, expect, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../../../.env.${stage}`);
delete process.env.BASE_URL;
config({ path: envPath });

const baseURL = 'https://kbqgze06da.execute-api.ap-southeast-2.amazonaws.com/dev/'

describe('CASE TEST: THÊM SÁCH VÀO TRONG CATEGORY', () => {
  // Admin create Category
    let CategoryId
    describe('Admin thêm mới Category và thêm quyển sách vào trong đó.', () => {
        // Admin create an new Category in database
        it('Admin thêm mới Category trả lại statusCode 200 và thông báo thành công', async () => {
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

        it('Thêm một cuốn sách vào category nhưng bookID không đúng, kết quả trả về 404 và thông báo', async () => {
        // WHEN // 9780231153682 it not the real isdb of a book
        const response = await fetch(`${baseURL}/categories/${CategoryId}/books/9780231153682`, {
            method: 'POST'
        })
        let bodyJson
            if (!response.ok) {
                const bodyText = await response.text();
                bodyJson = JSON.parse(bodyText);
            }
        // console.log('bodyJson', bodyJson)

        // THEN
        expect(response.status).toBe(404)
        expect(bodyJson.message).toBe('The book does not exist')
        })

        // it('Add a Book in to category but bookID is not real, it should return 404 and message', async () => {
        //     // WHEN // 9780231153682 it not the real isdb of a book
        //     const response = await fetch(`${baseURL}/categories/${CategoryId}/books/9780231153682`, {
        //     method: 'POST'
        //     })
        //     let bodyJson
        //     if (!response.ok) {
        //         const bodyText = await response.text();
        //         bodyJson = JSON.parse(bodyText);
        //     }
        //     // console.log('bodyJson', bodyJson)
    
        //     // THEN
        //     expect(response.status).toBe(404)
        //     expect(bodyJson.message).toBe('The book does not exist')
        // })

        it('Thêm Sách vào category nhưng category không tồn tại, kết quả trả về 500 và thông báo', async () => {
            // WHEN // 9780231153683 these id is a real book 
            const response = await fetch(`${baseURL}/categories/${CategoryId}12/books/9780231153683`, {
              method: 'POST'
            })
            let bodyJson
              if (!response.ok) {
                  const bodyText = await response.text();
                  bodyJson = JSON.parse(bodyText);
              }
      
            // THEN
            expect(response.status).toBe(500)
            expect(bodyJson.message).toBe('The category does not exist')
        })

        it('Thêm thành công sách vào category', async () => {
            // WHEN // 9780231153683 these id is a real book 
            const response = await fetch(`${baseURL}/categories/${CategoryId}/books/9780231153683`, {
              method: 'POST'
            })
      
            // THEN
            expect(response.status).toBe(200)
        })
    })
})