import product from './product.json';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/actions/user'

export async function GET(request) {
  const url = new URL(request.url);
  const VendorId = url.searchParams.get('vendorId');
  const fetchVendor = async (vendorId) => {
    try {
      const token = await verifyToken().catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
      })
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      return null;
    }
  };
  const fetchReview = async (product_id) => {
    const reviewData = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API}/general-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: product_id })
    });

    const review = await reviewData.json();
    const result = (review?.total_rating / review?.rating_count) || 0
    console.log('total result', result)
    return result
  }

  if (VendorId) {
    try {
      const products = await fetch(`${process.env.API_URL}/products?vendorId=${VendorId}`).then(res => res.json());
      const approvedProducts = products.filter(product => product.status === "APPROVED");
      const result = await Promise.all(approvedProducts.filter(product => product.vendorId).map(async product => {
        if (product.vendorId) {
        const vendorInfo = await fetchVendor(product.vendorId);
        const reviewInfo = await fetchReview(product.productId);
        if (vendorInfo && Object.keys(vendorInfo).length > 0) {
          return { ...product, store: vendorInfo, rating_count: reviewInfo};
        } else {
          return null
        }
      }}));

      const resultsWithNulls = await Promise.all(result);
      const Results = resultsWithNulls.filter(result => result !== null);
      
      return NextResponse.json(Results);  // Return the enhanced product list
    } catch (error) {
      console.error('Error processing products:', error);
      return NextResponse.json([]);  // Return an empty array on error
    }
  }

  // Fetch all products and enhance them with vendor data
  try {
    const products = await fetch(`${process.env.API_URL}/products?ids`).then(res => res.json());
    const result = await Promise.all(products.map(async product => { 
      if (product.vendorId) {
      const vendorInfo = await fetchVendor(product.vendorId);
      const reviewInfo = await fetchReview(product.productId);
      if (vendorInfo && Object.keys(vendorInfo).length > 0) {
        return { ...product, store: vendorInfo, rating_count: reviewInfo};
      } else {
        return null
      }
    }}));

    const resultsWithNulls = await Promise.all(result);
    const Results = resultsWithNulls.filter(result => result !== null);
    return NextResponse.json(Results);  // Return the enhanced product list
  } catch (error) {
    console.error('Error processing products:', error);
    return NextResponse.json([]);  // Return an empty array on error
  }
}

// import product from './product.json'
// import { NextResponse } from 'next/server'

// export async function GET(request) {
//   // console.dir(request?.nextUrl, { depth: 5 })
//   // const pathname = request.nextUrl.pathname
//   const searchParams = request.nextUrl?.searchParams
//   const queryCategory = searchParams.get('category')
//   const querySortBy = searchParams.get('sortBy')
//   const querySearch = searchParams.get('search')
//   // const status = searchParams.get('status')
//   const ids = searchParams.get('ids')

//   const fetchVendor = async (vendorId) => {
//     const token = await fetchAuthSession()
//       .then(session => session?.tokens?.idToken?.toString())
//       .catch(error => null)
//     const vendor = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`, {
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     }).then(res => res.json())

//     // console.log({ token, order })
//     return vendor
//   }

//   if (ids && ids.length > 0) {
//     const products = await fetch(`${process.env.API_URL}/products?ids`)
//       .then(res => res.json())
//       .catch(error => {
//         console.error(error.message)
//         return []
//       })
//     console.log({ products: products })
//     products.map(product => {
//       products.store = await fetchVendor(product?.vendorId) || {}
//     }
//     return NextResponse.json(result)
//   }

//   // let products = product?.data || []

//   // if (querySortBy || queryCategory || querySearch) {
//   //   products = product?.data?.filter(
//   //     product =>
//   //       queryCategory &&
//   //       product?.categories?.length &&
//   //       product?.categories?.some(category => queryCategory?.split(',')?.includes(category.slug))
//   //   )
//   //   products = products.length ? products : product?.data

//   //   if (querySortBy === 'asc') {
//   //     products = products.sort((a, b) => {
//   //       if (a.id < b.id) {
//   //         return -1
//   //       } else if (a.id > b.id) {
//   //         return 1
//   //       }
//   //       return 0
//   //     })
//   //   } else if (querySortBy === 'desc') {
//   //     products = products.sort((a, b) => {
//   //       if (a.id > b.id) {
//   //         return -1
//   //       } else if (a.id < b.id) {
//   //         return 1
//   //       }
//   //       return 0
//   //     })
//   //   } else if (querySortBy === 'a-z') {
//   //     products = products.sort((a, b) => {
//   //       if (a.name < b.name) {
//   //         return -1
//   //       } else if (a.name > b.name) {
//   //         return 1
//   //       }
//   //       return 0
//   //     })
//   //   } else if (querySortBy === 'z-a') {
//   //     products = products.sort((a, b) => {
//   //       if (a.name > b.name) {
//   //         return -1
//   //       } else if (a.name < b.name) {
//   //         return 1
//   //       }
//   //       return 0
//   //     })
//   //   } else if (querySortBy === 'low-high') {
//   //     products = products.sort((a, b) => {
//   //       if (a.sale_price < b.sale_price) {
//   //         return -1
//   //       } else if (a.price > b.price) {
//   //         return 1
//   //       }
//   //       return 0
//   //     })
//   //   } else if (querySortBy === 'high-low') {
//   //     products = products.sort((a, b) => {
//   //       if (a.sale_price > b.sale_price) {
//   //         return -1
//   //       } else if (a.price < b.price) {
//   //         return 1
//   //       }
//   //       return 0
//   //     })
//   //   }

//   //   if (querySearch) {
//   //     products = products.filter(product =>
//   //       product.name.toLowerCase().includes(querySearch.toLowerCase())
//   //     )
//   //   }
//   // }

//   // products = products?.length ? products : product?.data
//   // return NextResponse.json(products)
// }
