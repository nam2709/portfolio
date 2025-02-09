const isZaloPayAvailable = () => {
    return Boolean(process.env.NEXT_PUBLIC_PAYMENT_API);
};

export { isZaloPayAvailable };
