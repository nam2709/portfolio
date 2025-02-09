const apiGetVendor = async (vendorId) => {
    // Fetch vendor details
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`);

    return response
};

export { apiGetVendor }