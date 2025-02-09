import { useContext } from 'react'
import { Form, Formik } from 'formik'
import Avatar from '@/Components/Common/Avatar'
import CustomModal from '@/Components/Common/CustomModal'
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField'
import Btn from '@/Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { YupObject, nameSchema } from '@/Utils/Validation/ValidationSchemas'
import { useTranslation } from '@/app/i18n/client'
import { placeHolderImage } from '../../../../../Data/CommonPath'
import ProductBox1Rating from '@/Components/Common/ProductBox/ProductBox1/ProductBox1Rating'
import { fetchAuthSession } from "aws-amplify/auth"
import { ModalFooter } from 'reactstrap'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const ReviewModal = ({ modal, setModal, productState }) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')

  const handleCreateReview = async (values) =>{
    console.log('values', values)
    const token = await fetchAuthSession();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API}/create-review`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`
            },
            body: JSON.stringify(values)
        });

        if (!response.ok) {
          const errorDetails = await response.clone().json().catch(() => null);
          ToastNotification('error', errorDetails.message)
        }

        const data = await response.json();
        return data.Item;
        ToastNotification('success', 'Create Success')
        
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
  }

  return (
    <CustomModal
      modal={modal ? true : false}
      setModal={setModal}
      classes={{
        modalClass: 'theme-modal',
        title: productState?.product?.user_review
          ? 'EditReview'
          : 'Writeareview',
      }}
    >
      <Formik
        initialValues={{
          rating: productState?.product?.user_review?.rating,
          description: productState?.product?.user_review?.description,
          productId: productState?.product?.id,
          review_image_id: '',
        }}
        validationSchema={YupObject({
          rating: nameSchema,
        })}
        onSubmit={async values => {
          await handleCreateReview(values)
          setModal(false)
        }}
      >
        {({ values, setFieldValue, errors }) => (
          <Form className="product-review-form">
            <div className="product-wrapper">
              <div className="product-image">
                <Avatar
                  data={
                    productState?.product?.product_thumbnail
                      ? productState?.product?.product_thumbnail
                      : placeHolderImage
                  }
                  customImageClass="img-fluid"
                  name={productState?.product?.name}
                />
              </div>
              <div className="product-content">
                <h5 className="name">{productState?.product?.name}</h5>
                <div className="product-review-rating">
                  <label>{t('Rating')}</label>
                  <div className="product-rating">
                    <ProductBox1Rating
                      totalRating={productState?.product?.rating_count}
                    />
                    <h6 className="rating-number">
                      {productState?.product?.rating_count?.toFixed(2) || 0}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-box">
              <div className="product-review-rating">
                <label>{t('Rating')}</label>
                <div className="product-rating">
                  <ProductBox1Rating
                    totalRating={productState?.product?.user_review?.rating}
                    clickAble={true}
                    setFieldValue={setFieldValue}
                    name={'rating'}
                  />
                </div>
              </div>
            </div>
            <div className="review-box">
              <SimpleInputField
                nameList={[
                  {
                    name: 'description',
                    placeholder: t('EnterDescription'),
                    type: 'textarea',
                    toplabel: 'ReviewContent',
                    rows: 3,
                  },
                ]}
              />
            </div>
            <ModalFooter className="pt-0">
              <Btn
                className="btn-md btn-theme-outline fw-bold"
                title="Cancel"
                type="button"
                onClick={() => setModal('')}
              />
              <Btn
                className="btn-md fw-bold text-light theme-bg-color"
                title="Submit"
                type="submit"
              />
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </CustomModal>
  )
}

export default ReviewModal
