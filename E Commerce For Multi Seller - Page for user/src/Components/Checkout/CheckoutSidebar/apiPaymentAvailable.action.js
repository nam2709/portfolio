const apiPaymentAvailable = async (orderId) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;

    const intervalId = setInterval(async () => {
      attempts++;
      console.log('Checking data availability, attempt:', attempts);

      // Make the API call to check for data
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_API}/payment-order/${orderId}`);
        const data = await response.json();

        if (data?.PaymentId) { // Check if data is not empty
          console.log('Data is now available:', data);
          clearInterval(intervalId);
          resolve(data); // Resolve the promise with the data
        } else if (attempts >= maxAttempts) {
          console.log('No data available after maximum attempts.');
          clearInterval(intervalId);
          reject(new Error('No data available after maximum attempts')); // Reject the promise
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        clearInterval(intervalId);
        reject(error); // Reject the promise with the error
      }
    }, 1000);
  });
}
  
export { apiPaymentAvailable }