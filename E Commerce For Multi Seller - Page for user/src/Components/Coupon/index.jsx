'use client';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useParams } from 'next/navigation'
import { getHostApi } from '@/Utils/AxiosUtils'
import './Coupon.css'

const CouponPage = () => {
    const [coupon, setCoupon] = useState(null)
    const param = useParams()
    const CouponId = param.id

    useEffect(() => {
        const handleCoupon = async () => {
            try {
                const session = await fetchAuthSession();
                const token = session?.tokens?.idToken.toString();

                const response = await fetch(`${getHostApi()}coupon`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                });
                const coupons = await response.json();

                const selectedCoupon = coupons.find(elem => elem.CouponId === CouponId);
                setCoupon(selectedCoupon);

            } catch (error) {
                console.error('Error fetching coupon:', error);
            }
        };
      
        handleCoupon();
    }, []);

    return (
        <Row>
            {coupon ? (
                <Col xs={12}>
                    <div className="coupon-container">
                        <div className="coupon-header">
                            <h2>Chi tiết Mã giảm giá</h2>
                        </div>
                        <br />
                        <div className="coupon-body">
                            <div className="usage-details">
                                <h3>Hạn sử dụng mã</h3>
                                <p>{new Date(coupon?.start_date).toLocaleDateString('en-GB')} - {new Date(coupon?.end_date).toLocaleDateString('en-GB')}</p>
                                <h3>Ưu đãi</h3>
                                <p>Mua sắm ngay tại đây</p>
                                <h3>Phương thức thanh toán</h3>
                                <p>Mọi hình thức thanh toán</p>
                                <h3>Thiết bị</h3>
                                <p>iOS, Android, Máy Tính</p>
                                <h3>Điều kiện</h3>
                                <p>Sử dụng mã giảm giá cho đơn hàng thỏa điều kiện ưu đãi khi mua hàng trên Kamarket.</p>
                                <h3>Sản phẩm áp dụng</h3>
                                <p>
                                {coupon?.products?.length > 0
                                    ? coupon.products.join(', ')
                                    : "Không có sản phẩm loại trừ."
                                }
                                </p>
                                <h3>Sản phẩm loại trừ</h3>
                                <p>
                                {coupon?.exclude_products?.length > 0
                                    ? coupon.exclude_products.join(', ')
                                    : "Không có sản phẩm loại trừ."
                                }
                                </p>
                            </div>
                        </div>
                    </div>
                    <br />
                </Col>
            ) : (
                <p>Loading or no coupon found...</p>
            )}
        </Row>
    );
};

export default CouponPage;
