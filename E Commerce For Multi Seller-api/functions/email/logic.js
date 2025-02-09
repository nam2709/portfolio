export function isCreateVendor(record) {
  return record?.eventName === 'INSERT';
}

export function isApprovedVendor(record, newImage, oldImage) {
  return (
    record?.eventName === 'MODIFY' &&
    newImage?.status === 'APPROVED' &&
    oldImage?.status === 'PENDING'
  );
}

export function isCreateOrder(record) {
  return record?.eventName === 'INSERT';
}

export function isCreateProduct(record) {
  return record?.eventName === 'INSERT';
}