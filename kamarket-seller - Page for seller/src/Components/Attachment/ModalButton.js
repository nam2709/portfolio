import React, { useContext } from 'react'
import { useTranslation } from '@/app/i18n/client'
import Btn from '../../Elements/Buttons/Btn'
import I18NextContext from '@/Helper/I18NextContext'
import { fetchAuthSession } from 'aws-amplify/auth'
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification'

const ModalButton = ({
  setModal,
  attachmentsData,
  dispatch,
  state,
  name,
  selectedImage,
  setSelectedImage,
  setFieldValue,
  tabNav,
  multiple,
  showImage,
}) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const storeImageObject = name?.split('_id')[0]

  async function deleteImage() {
    try {
      // Fetching the authentication session and token
      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
  
      // If no token is found, throw an Unauthorized error
      if (!token) {
        throw new Error('Unauthorized');
      }
  
      for (const image of state.selectedImage) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileId: image })
        });
  
        // Optional: Handle different response scenarios
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error.message);
      throw error;
    }
  }

  const handleDelete = async () => {
    console.log('DELETE_IMAGE')
    try {
      await deleteImage()
      ToastNotification('success', 'Delete Success')
    } catch (error) {
      ToastNotification('error', 'Error deleting user')
    } finally {
      dispatch({ type: 'SELECTEDIMAGE', payload: [] })
    }
  }

  // Selecting the images from media modal
  const handleClick = value => {
    if (tabNav == 2) {
      if (state.setBrowserImage) {
        let formData = new FormData()
        Object.values(state.setBrowserImage.attachments).forEach((el, i) => {
          formData.append(`attachments[${i}]`, el)
        })
        // Put Add Or Update Logic Here
      }
    } else {
      if (multiple) {
        console.log('11111111111111')
        // value &&
        //   value.forEach(element => {
            if (state.selectedImage) {
              setFieldValue(storeImageObject, [...selectedImage, ...value]);
              setSelectedImage(prevState => [...prevState, ...value]);
              // setFieldValue(
              //   name,
              //   state.selectedImage.map(elemmm => elemmm.imageId)
              // );
            }
        // });
      } else {
        if (state?.selectedImage?.length > 0) {
          if (showImage) {
            setFieldValue(name, value[0])
          } else {
            setFieldValue(
              name,
              attachmentsData?.find(item => {
                return item.imageId == value[0]?.imageId
              }).id
            )
            storeImageObject &&
              setFieldValue(
                storeImageObject,
                attachmentsData?.find(item => {
                  return item.imageId == value[0]?.imageId
                })
              )
            setSelectedImage([
              attachmentsData?.find(item => {
                return item.imageId == value[0]?.imageId
              }),
            ])
          }
        }
      }
    }
    setModal(false)
  }
  return (
    <>
      <div className="media-bottom-btn">
        <div className="left-part">
          <div className="file-detail">
            <h6>
              {state.selectedImage?.length || 0} {t('FileSelected')}
            </h6>
            <a
              href="#"
              className="font-red"
              onClick={() => handleDelete()}
            >
              {t('Clear')}
            </a>
          </div>
        </div>
        <div className="right-part">
          <Btn
            type="submit"
            className="btn btn-solid"
            title={tabNav === 2 ? 'Submit' : t('InsertMedia')}
            onClick={() => handleClick(state.selectedImage)}
          />
        </div>
      </div>
    </>
  )
}

export default ModalButton
