import React from 'react'
import { Input, Label } from 'reactstrap'
import AttachmentsDropdown from './AttachmentDropdown'
import NoDataFound from '../CommonComponent/NoDataFound'
import Image from 'next/image'

const MediaData = ({ state, dispatch, attachmentsData, refetch }) => {
  // Deleting the selected images from media module
  const ChoseImages = (e, item) => {
    console.log('e', e)
    console.log('item', item)
    let temp = [...state.deleteImage]
    if (temp?.includes(item.imageId) && !e.target.checked) {
      temp.splice(temp.indexOf(item.imageId), 1)
      dispatch({ type: 'DeleteSelectedImage', payload: temp })
    }
    if (e.target.checked) {
      dispatch({ type: 'DeleteSelectedImage', payload: [...state.deleteImage, item.imageId] })
    }
  }
  return (
    <>
      {attachmentsData?.length > 0 ? (
        attachmentsData?.map((elem, i) => (
          <div key={i}>
            <div className="library-box">
              <Input
                type="checkbox"
                id={elem.imageId}
                checked={state.deleteImage?.includes(elem.imageId)}
                onChange={e => ChoseImages(e, elem)}
              />
              <Label htmlFor={elem.imageId}>
                <div className="ratio ratio-1x1">
                  <Image
                    src={elem.url || elem.original_url}
                    className="img-fluid"
                    alt=""
                    height={130}
                    width={130}
                  />
                </div>
                {/* <AttachmentsDropdown
                  state={state}
                  dispatch={dispatch}
                  id={elem?.id}
                  refetch={refetch}
                /> */}
              </Label>
            </div>
          </div>
        ))
      ) : (
        <NoDataFound title={'NoMediaFound'} />
      )}
    </>
  )
}

export default MediaData
