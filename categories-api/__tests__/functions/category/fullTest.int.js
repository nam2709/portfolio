import { describe, it, expect, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../../../.env.${stage}`);
delete process.env.BASE_URL;
config({ path: envPath });

const baseURL = 'https://kbqgze06da.execute-api.ap-southeast-2.amazonaws.com/dev/'

describe('TEST CASE: FULL TEST CASE', () => {
  // Admin create Category
  let CategoryId
  let SubcategoryId1
  let SubcategoryId2
  let SubcategoryId3
  let SubSubcategoryId_1_1
  let SubSubcategoryId_1_2
  let SubSubcategoryId_3_1
  describe('Admin tạo mới category', () => {
    // Admin create an new Category in database
    it('B1: Admin tạo mới Category', async () => {
      // GIVEN
      const payload = {
        "name": "Category",
        "slug": "Category",
        "description": "Category"
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
      expect(result.category.name).toBe('Category')
    })

    it('B2: Admin thêm mới Category Con của Category Chính - SubcategoryId1', async () => {
        // GIVEN
        const payload = {
          "categoryId": CategoryId,
          "name": "SCategory1",
          "slug": "SCategory1",
          "description": "SCategory1"
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
        SubcategoryId1 = result.category.categoryId
        // THEN
        expect(response.status).toBe(200)
        expect(result.message).toBe('Category created')
        expect(result.category.name).toBe('SCategory1')
    })
  
    it('B3: Admin thêm mới Category Con của Category Chính - SubcategoryId2', async () => {
        // GIVEN
        const payload = {
          "categoryId": CategoryId,
          "name": "SCategory2",
          "slug": "SCategory2",
          "description": "SCategory2"
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
        SubcategoryId2 = result.category.categoryId
        // THEN
        expect(response.status).toBe(200)
        expect(result.message).toBe('Category created')
        expect(result.category.name).toBe('SCategory2')
    })

    it('B4: Admin thêm mới Category Con của Category Chính - SubcategoryId3', async () => {
        // GIVEN
        const payload = {
          "categoryId": CategoryId,
          "name": "SCategory3",
          "slug": "SCategory3",
          "description": "SCategory3"
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
        SubcategoryId3 = result.category.categoryId
        // THEN
        expect(response.status).toBe(200)
        expect(result.message).toBe('Category created')
        expect(result.category.name).toBe('SCategory3')
    })

    it('B5: Admin thêm mới Category Con của Category Con SubcategoryId1 - SubSubcategoryId_1_1', async () => {
        // GIVEN
        const payload = {
          "categoryId": SubcategoryId1,
          "name": "SCategory11",
          "slug": "SCategory11",
          "description": "SCategory11"
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
        SubSubcategoryId_1_1 = result.category.categoryId
        // THEN
        expect(response.status).toBe(200)
        expect(result.message).toBe('Category created')
        expect(result.category.name).toBe('SCategory11')
    })

    it('B6: Admin thêm mới Category Con của Category Con SubcategoryId1 - SubSubcategoryId_1_2', async () => {
        // GIVEN
        const payload = {
          "categoryId": SubcategoryId1,
          "name": "SCategory12",
          "slug": "SCategory12",
          "description": "SCategory12"
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
        SubSubcategoryId_1_2 = result.category.categoryId
        // THEN
        expect(response.status).toBe(200)
        expect(result.message).toBe('Category created')
        expect(result.category.name).toBe('SCategory12')
    })

    it('B7: Admin thêm mới Category Con của Category Con SubcategoryId3 - SubSubcategoryId_3_1', async () => {
        // GIVEN
        const payload = {
          "categoryId": SubcategoryId3,
          "name": "SCategory31",
          "slug": "SCategory31",
          "description": "SCategory31"
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
        SubSubcategoryId_3_1 = result.category.categoryId
        // THEN
        expect(response.status).toBe(200)
        expect(result.message).toBe('Category created')
        expect(result.category.name).toBe('SCategory31')
    })

    it('TEST ERROR: Thêm sách 9780593833339 vào tất cả các tập hợp con lỗi vì Sách không tồn tại Category Chính', async () => {
        // WHEN // 9780231153683 these id is a real book 
        const response = await fetch(`${baseURL}/categories/${SubcategoryId1?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        const response1 = await fetch(`${baseURL}/categories/${SubcategoryId2?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        const response2 = await fetch(`${baseURL}/categories/${SubcategoryId3?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        const response3 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_1?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        const response4 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_2?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        const response5 = await fetch(`${baseURL}/categories/${SubSubcategoryId_3_1?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })
    
        let bodyJson
        let bodyJson3
        if (!response.ok) {
            const bodyText = await response.text();
            const bodyText3 = await response3.text();
            bodyJson = JSON.parse(bodyText);
            bodyJson3 = JSON.parse(bodyText3);
        }
    
        // THEN
        expect(response.status).toBe(500)
        expect(bodyJson.message).toBe('The book doesnt belong to the parrent Id yet, you need to add to the parrent before put it in here')
        expect(response1.status).toBe(500)
        expect(response2.status).toBe(500)
        expect(response3.status).toBe(500)
        expect(bodyJson3.message).toBe('The book doesnt belong to the parrent Id yet, you need to add to the parrent before put it in here')
        expect(response4.status).toBe(500)
        expect(response5.status).toBe(500)
    })

    it('B8: Thêm sách vào category (9780593833339, 9780231153683, 9780812981605)', async () => {
        // WHEN // 9780231153683 these id is a real book 
        const response = await fetch(`${baseURL}/categories/${CategoryId}/books/9780231153683`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response1 = await fetch(`${baseURL}/categories/${CategoryId}/books/9780593833339`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response2 = await fetch(`${baseURL}/categories/${CategoryId}/books/9780812981605`, {
            method: 'POST'
        })
    
        // THEN
        expect(response.status).toBe(200)
        expect(response1.status).toBe(200)
        expect(response2.status).toBe(200)
    })

    it('B9: Thêm sách vào sub category1 (9780593833339, 9780231153683, 9780812981605)', async () => {
        // WHEN // 9780231153683 these id is a real book 
        const response = await fetch(`${baseURL}/categories/${SubcategoryId1?.replace(/#SUB/g, '.')}/books/9780231153683`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response1 = await fetch(`${baseURL}/categories/${SubcategoryId1?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response2 = await fetch(`${baseURL}/categories/${SubcategoryId1?.replace(/#SUB/g, '.')}/books/9780812981605`, {
            method: 'POST'
        })
    
        // THEN
        expect(response.status).toBe(200)
        expect(response1.status).toBe(200)
        expect(response2.status).toBe(200)
    })

    it('B10: Thêm sách vào sub sub category1_1 (9780593833339, 9780231153683, 9780812981605)', async () => {
        // WHEN // 9780231153683 these id is a real book 
        const response = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_1?.replace(/#SUB/g, '.')}/books/9780231153683`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response1 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_1?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response2 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_1?.replace(/#SUB/g, '.')}/books/9780812981605`, {
            method: 'POST'
        })
    
        // THEN
        expect(response.status).toBe(200)
        expect(response1.status).toBe(200)
        expect(response2.status).toBe(200)
    })

    it('B11: Thêm sách vào sub sub category1_2 (9780593833339, 9780231153683, 9780812981605)', async () => {
        // WHEN // 9780231153683 these id is a real book 
        const response = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_2?.replace(/#SUB/g, '.')}/books/9780231153683`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response1 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_2?.replace(/#SUB/g, '.')}/books/9780593833339`, {
            method: 'POST'
        })

        // WHEN // 9780593833339 these id is a real book 
        const response2 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_2?.replace(/#SUB/g, '.')}/books/9780812981605`, {
            method: 'POST'
        })
    
        // THEN
        expect(response.status).toBe(200)
        expect(response1.status).toBe(200)
        expect(response2.status).toBe(200)
    })

    it('B12: Liệt kê books trong category, sub category1, sub sub category1_1', async () => {
        // Ensure CategoryId is set before making the request
        expect(CategoryId).toBeDefined();

        // WHEN
        const response = await fetch(`${baseURL}/categories/${CategoryId}/books`, {
            method: 'GET'
        });
        const result = await response.json();

        const response1 = await fetch(`${baseURL}/categories/${SubcategoryId1?.replace(/#SUB/g, '.')}/books`, {
            method: 'GET'
        });
        const result1 = await response1.json();

        const response2 = await fetch(`${baseURL}/categories/${SubSubcategoryId_1_1?.replace(/#SUB/g, '.')}/books`, {
            method: 'GET'
        });
        const result2 = await response2.json();
        // console.log('CategoryId', CategoryId);
        // console.log('result list', result);

        // THEN
        expect(response.status).toBe(200);
        expect(response1.status).toBe(200);
        // Optionally, you can check that the result contains books or the expected format
        expect(result[0].bookId).toBe('9780231153683'); // Adjust this based on the actual response structure
        expect(result1[0].bookId).toBe('9780231153683'); // Adjust this based on the actual response structure
        expect(result2[0].bookId).toBe('9780231153683'); // Adjust this based on the actual response structure
    });

    it('B13: Xóa sub category1', async () => {
        // WHEN
        const response = await fetch(`${baseURL}/category/${SubcategoryId1?.replace(/#SUB/g, '.')}`, {
        method: 'DELETE'
        })
        const result = await response.json();
        // console.dir(result, { depth: null })
        // THEN
        expect(response.status).toBe(200)
    });

    it('B14: Check xem còn sub category1,  sub category1_1, sub category1_2 không', async () => {
        const response = await fetch(`${baseURL}/category/${SubcategoryId1?.replace(/#SUB/g, '.')}`, {
            method: 'GET'
        })

        const response1 = await fetch(`${baseURL}/category/${SubSubcategoryId_1_1?.replace(/#SUB/g, '.')}`, {
            method: 'GET'
        })

        const response2 = await fetch(`${baseURL}/category/${SubSubcategoryId_1_2?.replace(/#SUB/g, '.')}`, {
            method: 'GET'
        })

        expect(response.status).toBe(200)
        expect(response1.status).toBe(200)
        expect(response2.status).toBe(200)

        // Check if the response body is not empty before parsing it
        const body = await response.text(); // Get raw text for debugging
        const body1 = await response1.text();
        const body2 = await response2.text();

        // Now parse if the body is not empty
        const jsonBody = body ? JSON.parse(body) : [];
        const jsonBody1 = body1 ? JSON.parse(body1) : [];
        const jsonBody2 = body2 ? JSON.parse(body2) : [];

        // Assert that the response bodies are empty arrays
        expect(jsonBody).toEqual([]);
        expect(jsonBody1).toEqual([]);
        expect(jsonBody2).toEqual([]);
    })

    it('B15: Check xem list categories của books (9780593833339) còn ở category và xóa khỏi sub category1, sub category1_1, sub category1_2', async () => {
        const response = await fetch(`${baseURL}/books/9780593833339/categories`, {
            method: 'GET'
        })
        const result = await response.json();
        console.log('result', result)
       

        expect(response.status).toBe(200)
        // Find the object with the matching categoryId
        const foundCategory = result.categories.find(item => item.categoryId === CategoryId);
        expect(foundCategory).toBeDefined()
    })
  })
})