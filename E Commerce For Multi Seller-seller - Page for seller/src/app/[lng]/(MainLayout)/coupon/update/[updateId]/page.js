"use client";
import CouponForm from "@/Components/Coupon/CouponForm";

const CouponUpdate = ({ params }) => {
  return (
    params?.updateId && (
      <CouponForm updateId={params?.updateId} title={"UpdateCoupon"} />
    )
  );
};

export default CouponUpdate;
