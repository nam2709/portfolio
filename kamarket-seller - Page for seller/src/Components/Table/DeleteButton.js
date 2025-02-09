import React, { useContext, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { RiDeleteBinLine } from "react-icons/ri";
import ShowModal from "../../Elements/Alerts&Modals/Modal";
import Btn from "../../Elements/Buttons/Btn";
import I18NextContext from "@/Helper/I18NextContext";
import { fetchAuthSession } from 'aws-amplify/auth';
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification';

async function deleteCoupon({ CouponId }) {
  try {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null)

    if (!token) throw new Error('Unauthorized')

    const response = await fetch(`${process.env.NEXT_PUBLIC_COUPON_API}/coupon/${CouponId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error deleting user:', error.message)
    throw error
  }
}

async function deleteProduct({ productId }) {
  try {
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null)

    if (!token) throw new Error('Unauthorized')

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error deleting user:', error.message)
    throw error
  }
}

const DeleteButton = ({ refetch, obj, noImage }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const [modal, setModal] = useState(false);

  const handleClick = async () => {
    console.log('remove', obj)
    // Delete User
    if (obj?.UserStatus) {
      // console.log({ DELETE_USER: { userId: obj.Username || obj.id } })
      // try {
      //   await deleteUser({ userId: obj.Username || obj.id })
      //   refetch()
      //   ToastNotification('success', 'Xóa người dùng thành công')
      // } catch (error) {
      //   ToastNotification('error', 'Error Deleting')
      // } finally {
      //   setModal(false)
      // }
    } else if (obj?.CouponId) {
      console.log({ DELETE_COUPON: { CouponId: obj.CouponId || obj.id } })
      try {
        await deleteCoupon({ CouponId: obj.CouponId || obj.id })
        refetch()
        ToastNotification('success', 'Xóa mã khuyến mại thành công')
      } catch (error) {
        ToastNotification('error', 'Error Deleting')
      } finally {
        setModal(false)
      }
    } else if (obj?.categoryId) {
      // console.log({ DELETE_Category: { categoryId: obj.categoryId } })
      // try {
      //   await deleteCategory({ CategoryId: obj.categoryId })
      //   refetch()
      //   ToastNotification('success', 'Xóa danh mục thành công')
      // } catch (error) {
      //   ToastNotification('error', 'Error Deleting')
      // } finally {
      //   setModal(false)
      // }
    } else if (obj?.productId && obj?.product_galleries) {
      console.log({ DELETE_PRODUCT: { productId: obj.productId } })
      try {
        await deleteProduct({ productId: obj.productId })
        refetch()
        ToastNotification('success', 'Xóa sản phẩm thành công')
      } catch (error) {
        ToastNotification('error', 'Error Deleting')
      } finally {
        setModal(false)
      }
    }
  }
  
  return (
    <>
      {obj && (
        <>
          {noImage ? (
            <Btn
              className="btn-outline"
              title="Delete"
              onClick={() => {
                setModal(true);
              }}
            />
          ) : (
            <a>
              <RiDeleteBinLine
                className="text-danger"
                onClick={() => {
                  setModal(true);
                }}
              />
            </a>
          )}
        </>
      )}
      <ShowModal
        open={modal}
        close={false}
        setModal={setModal}
        buttons={
          <>
            <Btn
              title="No"
              onClick={() => {
                setModal(false);
              }}
              className="btn--no btn-md fw-bold"
            />
            <Btn
              title="Yes"
              onClick={handleClick}
              className="btn-theme btn-md fw-bold"
            />
          </>
        }
      >
        <div className="remove-box">
          <RiDeleteBinLine className="icon-box" />
          <h2>{t("DeleteItem")}?</h2>
          <p>
            {t("ThisItemWillBeDeletedPermanently") +
              " " +
              t("YouCan'tUndoThisAction!!")}{" "}
          </p>
        </div>
      </ShowModal>
    </>
  );
};

export default DeleteButton;
