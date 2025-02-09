import { fetchAuthSession } from 'aws-amplify/auth';
import _ from 'lodash';
import { getHostApi } from '@/Utils/AxiosUtils'

const fetchOrders = async (product_id) => {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => {
        console.error('Error fetching auth session:', error);
        return null;
      });
  
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?product_id=${product_id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(orders => {
      console.log('Fetched orders:', orders);
      return orders;
    })
    .catch(error => {
      console.error('Error fetching orders:', error);
      return [];
    });
};

const isCanReview = async (product_id) => {
    console.log('product_id', product_id);
    const orders = await fetchOrders(product_id);

    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => {
        console.error('Error fetching auth session:', error);
        return null;
      });

    console.log('orders',orders)

    let results = new Set(); // Initialize as a Set if you want unique statuses only
    const fetchPromises = orders.map(async (order) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const status = data.order_status.name;
        results.add(status);
        return status || 'nothing'; // Provide a fallback if status is not defined
      } catch (error) {
        console.error('Fetch error for order:', order.orderId, error);
        results.add('fetch failed'); // You might want to add a specific status for failures
        return 'fetch failed'; // Return a string indicating failure in the promise array
      }
    });

    const statuses = await Promise.all(fetchPromises);
    const review = Array.from(results).some(status => status === 'delivered' || status === 'completed'); // Convert Set to Array to use 'some'
    console.log('Review status:', review);
    return review
};

export { fetchOrders, isCanReview };
