import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from 'reactstrap'
import { ErrorMessage } from 'formik'
import { useTranslation } from '@/app/i18n/client'
import { RiAddLine, RiCloseLine } from 'react-icons/ri'
import InputWrapper from '../../Utils/HOC/InputWrapper'
import AttachmentModal from '../Attachment/AttachmentModal'
import { handleModifier } from '../../Utils/Validation/ModifiedErrorMessage'
import I18NextContext from '@/Helper/I18NextContext'

const FileUploadField = ({
  values,
  updateId,
  setFieldValue,
  errors,
  multiple,
  loading,
  showImage,
  vendor,
  ...props
}) => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [modal, setModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState([])
  const storeImageObject = props.name.split('_id')[0]
  console.log('selectedImage', selectedImage)
  console.log('values', values)

  useEffect(() => {
    if (values) {
      multiple === true
        ? setSelectedImage(values[storeImageObject])
        : values[storeImageObject]
          ? setSelectedImage(loading ? null : [values[storeImageObject]])
          : setSelectedImage([])
      setFieldValue(values?.props?.name)
    }
  }, [values[storeImageObject]])
  useEffect(() => {
    if (props?.uniquename) {
      setSelectedImage(loading ? null : [props?.uniquename])
      setFieldValue(props?.name, props?.uniquename?.id)
    }
  }, [props?.uniquename, showImage])

  const removeImage = result => {
    console.log('result', result)
    if (storeImageObject) {
      setFieldValue(
        storeImageObject,
        Array.isArray(selectedImage)
          ? selectedImage.filter(el => el.imageId !== result.imageId)
          : null
      )
      setSelectedImage(selectedImage.filter(elem => elem.imageId !== result.imageId))
      // setFieldValue(storeImageObject, selectedImage.filter(elem => elem.imageId !== result.imageId))
    }
  }

  const ImageShow = () => {
    return (
      <>
        {selectedImage?.length > 0 &&
          selectedImage?.map((result, i) => (
            <li key={i}>
              <Image
                src={result?.url}
                className="img-fluid"
                width={100}
                height={100}
                alt=""
                priority
              />
              <p>
                <RiCloseLine className="remove-icon" onClick={() => removeImage(result)} />
              </p>
            </li>
          ))}
      </>
    )
  }
  return (
    <>
      <ul className={`image-select-list`}>
        <li className="choosefile-input">
          <Input
            {...props}
            onClick={event => {
              event.preventDefault()
              setModal(props.id)
            }}
          />
          <label htmlFor={props.id}>
            <RiAddLine />
          </label>
        </li>

        <ImageShow />
        <AttachmentModal
          modal={modal == props.id}
          vendor={vendor}
          name={props.name}
          multiple={multiple}
          values={values}
          setModal={setModal}
          setFieldValue={setFieldValue}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          showImage={showImage}
          redirectToTabs={true}
        />
      </ul>
      <p className="help-text">{props?.helpertext}</p>
      {errors?.[props?.name] ? (
        <ErrorMessage
          name={props.name}
          render={msg => (
            <div className="">
              {t(handleModifier(storeImageObject).split(' ').join(''))} {t('IsRequired')}
            </div>
          )}
        />
      ) : null}
    </>
  )
}

export default InputWrapper(FileUploadField)
