import React, { useContext, useEffect, useReducer, useState } from "react";
import { Row, TabContent, TabPane } from "reactstrap";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/app/i18n/client";
import ShowModal from "../../Elements/Alerts&Modals/Modal";
import { requiredSchema, YupObject } from "../../Utils/Validation/ValidationSchemas";
import FileUploadBrowser from "../InputFields/FileUploadBrowser";
import { attachment } from "../../Utils/AxiosUtils/API";
import Btn from "../../Elements/Buttons/Btn";
import request from "../../Utils/AxiosUtils";
import { selectImageReducer } from "../../Utils/AllReducers";
import AttachmentData from "./AttachmentData";
import TopSection from "./TopSection";
import ModalButton from "./ModalButton";
import TableBottom from "../Table/TableBottom";
import AttachmentModalNav from "./AttachmentModalNav";
import usePermissionCheck from "../../Utils/Hooks/usePermissionCheck";
import I18NextContext from "@/Helper/I18NextContext";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { fetchAuthSession } from "aws-amplify/auth";
import { ToastNotification } from "@/Utils/CustomFunctions/ToastNotification";
import useSWR from "swr";


const AttachmentModal = (props) => {
    const { modal, setModal, setFieldValue, name, selectedImage, setSelectedImage, isattachment, multiple, values, showImage, redirectToTabs, noAPICall, vendor } = props
    const [create] = usePermissionCheck(["create"], "attachment");
    const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
    const [tabNav, setTabNav] = useState(1);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [paginate, setPaginate] = useState(18);
    const [sorting, setSorting] = useState("");
    const [state, dispatch] = useReducer(selectImageReducer, { selectedImage: [], isModalOpen: "", setBrowserImage: '' });
    // const { data: attachmentsData, refetch } = useQuery([attachment], () => request({ url: attachment, params: { search, sort: sorting, paginate: paginate, page } }), { enabled: false, refetchOnWindowFocus: false, select: (data) => data?.data });
    async function fetchImage() {
        const token = await fetchAuthSession()
          .then(session => session)
          .catch(() => null)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`,
          },
        }).then(res => res.json())
      }
    
      const { data: attachmentsData, error, isLoading, mutate } = useSWR(`/upload`, fetchImage)

    useEffect(() => {
        modal && !noAPICall;
        isattachment && setTabNav(2)
    }, [search, sorting, page, paginate, modal]);


    return (
        <ShowModal open={modal} setModal={setModal} modalAttr={{ className: "media-modal modal-dialog modal-dialog-centered modal-xl" }} close={true} title={"InsertMedia"} noClass={true}
            buttons={tabNav === 1 && <ModalButton setModal={setModal} dispatch={dispatch} state={state} name={name} selectedImage={selectedImage} setSelectedImage={setSelectedImage} attachmentsData={attachmentsData?.data} setFieldValue={setFieldValue} tabNav={tabNav} multiple={multiple} values={values} showImage={showImage} />}>
            <AttachmentModalNav tabNav={tabNav} setTabNav={setTabNav} isattachment={isattachment} />
            <TabContent activeTab={tabNav}>
                {!isattachment && <TabPane className={tabNav == 1 ? "fade active show" : ""} id="upload">
                    <TopSection setSearch={setSearch} setSorting={setSorting} />
                    <div className="content-section select-file-section py-0 ratio2_3">
                        <Row xl={5} lg={4} sm={3} xs={2} className="g-sm-4 py-0 media-library-sec ratio_square g-2">
                            <AttachmentData isModal={true} attachmentsDatas={attachmentsData?.data} state={state} dispatch={dispatch} multiple={multiple} redirectToTabs={redirectToTabs} />
                        </Row>
                        <TableBottom current_page={attachmentsData?.current_page} total={attachmentsData?.total} per_page={attachmentsData?.per_page} setPage={setPage} />
                    </div >
                </TabPane>}
                {create && <TabPane className={tabNav == 2 ? "fade active show" : ""} id="select">
                    <div className="content-section drop-files-sec">
                        <div>
                            <RiUploadCloud2Line />
                            <Formik
                                initialValues={{ attachments: "" }}
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
                                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                                                method: 'POST',
                                                headers: {
                                                    Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`
                                                },
                                                body: formData,
                                                redirect: "follow"
                                            });
                                            if (response.ok) {
                                                ToastNotification("success", t("UpdateSuccess"));
                                                mutate(`/upload`, fetchImage);
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
                                                <h2>{t("Dropfilesherepaste")} <span>{t("or")}</span>
                                                    <FileUploadBrowser errors={errors} id="attachments" name="attachments" type="file" multiple={true} values={values} setFieldValue={setFieldValue} dispatch={dispatch} accept="image/*" />
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            {values?.attachments.length > 0 &&
                                                <a href="#javascript" onClick={() => setFieldValue('attachments', "")}>{t("Clear")}</a>
                                            }
                                            <Btn type="submit" className="ms-auto" title="Insert Media" />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>

                </TabPane >}
            </TabContent>
        </ShowModal >
    );
};
export default AttachmentModal;