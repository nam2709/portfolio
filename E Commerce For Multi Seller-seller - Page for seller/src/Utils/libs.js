export function isVendor(session) {
  return (
    session &&
    session?.tokens &&
    session?.tokens?.idToken &&
    session?.tokens?.idToken?.payload["cognito:groups"]?.includes("Vendor")
  )
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
