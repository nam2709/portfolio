import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Form, Formik } from 'formik'
import { Row, TabContent, TabPane } from 'reactstrap'
import { RiUploadCloud2Line } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from '@/app/i18n/client'
import ShowModal from '../../Elements/Alerts&Modals/Modal'
import { requiredSchema, YupObject } from '../../Utils/Validation/ValidationSchemas'
import FileUploadBrowser from '../InputFields/FileUploadBrowser'
import { attachment } from '../../Utils/AxiosUtils/API'
import Btn from '../../Elements/Buttons/Btn'
import request from '../../Utils/AxiosUtils'
import { selectImageReducer } from '../../Utils/AllReducers'
import AttachmentData from './AttachmentData'
import TopSection from './TopSection'
import ModalButton from './ModalButton'
import TableBottom from '../Table/TableBottom'
import AttachmentModalNav from './AttachmentModalNav'
import usePermissionCheck from '../../Utils/Hooks/usePermissionCheck'
import I18NextContext from '@/Helper/I18NextContext'
import { fetchAuthSession } from "aws-amplify/auth"
import { ToastNotification } from "@/Utils/CustomFunctions/ToastNotification"

const AttachmentModal = props => {
  const {
    modal,
    setModal,
    setFieldValue,
    name,
    setSelectedImage,
    isattachment,
    multiple,
    values,
    showImage,
    redirectToTabs,
    noAPICall,
  } = props
  const [create] = usePermissionCheck(['create'], 'attachment')
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [tabNav, setTabNav] = useState(1)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [paginate, setPaginate] = useState(18)
  const [sorting, setSorting] = useState('')
  const [state, dispatch] = useReducer(selectImageReducer, {
    selectedImage: [],
    isModalOpen: '',
    setBrowserImage: '',
  })
  const { data: attachmentsData, refetch } = useQuery(
    [attachment],
    () => request({ url: attachment, params: { search, sort: sorting, paginate: paginate, page } }),
    { enabled: false, refetchOnWindowFocus: false, select: data => data?.data }
  )
  useEffect(() => {
    modal && !noAPICall && refetch()
    isattachment && setTabNav(2)
  }, [search, sorting, page, paginate, modal])

  return (
    <ShowModal
      open={modal}
      setModal={setModal}
      modalAttr={{ className: 'media-modal modal-dialog modal-dialog-centered modal-xl' }}
      close={true}
      title={'InsertMedia'}
      noClass={true}
      buttons={
        tabNav === 1 && (
          <ModalButton
            setModal={setModal}
            dispatch={dispatch}
            state={state}
            name={name}
            setSelectedImage={setSelectedImage}
            attachmentsData={attachmentsData?.data}
            setFieldValue={setFieldValue}
            tabNav={tabNav}
            multiple={multiple}
            values={values}
            showImage={showImage}
          />
        )
      }
    >
      <AttachmentModalNav tabNav={tabNav} setTabNav={setTabNav} isattachment={isattachment} />
      <TabContent activeTab={tabNav}>
        {!isattachment && (
          <TabPane className={tabNav == 1 ? 'fade active show' : ''} id="upload">
            <TopSection setSearch={setSearch} setSorting={setSorting} />
            <div className="content-section select-file-section py-0 ratio2_3">
              <Row
                xl={5}
                lg={4}
                sm={3}
                xs={2}
                className="g-sm-4 py-0 media-library-sec ratio_square g-2"
              >
                <AttachmentData
                  isModal={true}
                  attachmentsData={attachmentsData?.data}
                  state={state}
                  refetch={refetch}
                  dispatch={dispatch}
                  multiple={multiple}
                  redirectToTabs={redirectToTabs}
                />
              </Row>
              <TableBottom
                current_page={attachmentsData?.current_page}
                total={attachmentsData?.total}
                per_page={attachmentsData?.per_page}
                setPage={setPage}
              />
            </div>
          </TabPane>
        )}
        {create && (
          <TabPane className={tabNav == 2 ? 'fade active show' : ''} id="select">
            <div className="content-section drop-files-sec">
              <div>
                <RiUploadCloud2Line />
                <Formik
                  initialValues={{ attachments: '' }}
                  validationSchema={YupObject({ attachments: requiredSchema })}
                  onSubmit={async (values, { resetForm }) => {
                      for (let i = 0; i < values.attachments.length; i++) {
                          let formData = new FormData();
                          formData.append("file", values.attachments[i], values.attachments[i]?.name);
                  
                          if (!redirectToTabs) {
                              setModal(false);
                          }
                          if (redirectToTabs) {
                              setTabNav(1);
                          }
                  
                          try {
                              const token = await fetchAuthSession();
                              const response = await fetch(`${process.env.API_URL}/upload`, {
                                  method: 'POST',
                                  headers: {
                                      Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`
                                  },
                                  body: formData,
                                  redirect: "follow"
                              });
                              if (response.ok) {
                                  refetch()
                                  ToastNotification("success", "Thêm hình ảnh thành công"); 
                              } else {
                                  throw new Error('Upload failed');
                              }
                          } catch (error) {
                              console.error(error.message);
                              throw error;
                          }
                      }
                  }}
                >
                  {({ values, setFieldValue, errors }) => (
                    <Form className="theme-form theme-form-2 mega-form">
                      <div>
                        <div className="dflex-wgap justify-content-center ms-auto save-back-button">
                          <h2>
                            {t('Dropfilesherepaste')} <span>{t('or')}</span>
                            <FileUploadBrowser
                              errors={errors}
                              id="attachments"
                              name="attachments"
                              type="file"
                              multiple={true}
                              values={values}
                              setFieldValue={setFieldValue}
                              dispatch={dispatch}
                              accept="image/*"
                            />
                          </h2>
                        </div>
                      </div>
                      <div className="modal-footer">
                        {values?.attachments.length > 0 && (
                          <a href="#javascript" onClick={() => setFieldValue('attachments', '')}>
                            {t('Clear')}
                          </a>
                        )}
                        <Btn type="submit" className="ms-auto" title="Insert Media" />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </TabPane>
        )}
      </TabContent>
    </ShowModal>
  )
}
export default AttachmentModal
