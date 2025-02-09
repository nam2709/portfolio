import React, { useContext, useState, useEffect } from 'react';
import { Col, ModalFooter, Row } from 'reactstrap';
import SearchableSelectInput from '@/Components/Common/InputFields/SearchableSelectInput';
import SimpleInputField from '@/Components/Common/InputFields/SimpleInputField';
import { AllCountryCode } from '../../../../Data/AllCountryCode';
import Btn from '@/Elements/Buttons/Btn';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Field } from 'formik'
import parsePhoneNumber from 'libphonenumber-js'

const EmailPasswordForm = ({ isLoading, setModal, formik, profile }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const [fieldValue, setFieldValue] = useState({});
  const [picture, setPicture] = useState('https://react.pixelstrap.net/fastkart/assets/avatar.png');

  console.log('picture', picture)
  console.log('formik', formik)
  console.log('profile', profile)
  const updateProfile = async () => {
    let formData = new FormData();
    if (fieldValue.attachments) {
      formData.append("file", fieldValue.attachments, fieldValue.attachments.name);
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

        console.log('response',response)

        if (!response.ok) throw new Error('Network response was not ok.');
        const responseData = await response.json();
        setPicture(responseData.url)
        formik.setFieldValue('profile', responseData.url)
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (fieldValue.attachments) {
      updateProfile();
    }
  }, [fieldValue]);

  useEffect(() => {
    if (profile) {
      setPicture(profile?.profile || 'https://react.pixelstrap.net/fastkart/assets/avatar.png');
      if (profile?.name) {
        formik.setFieldValue('name', profile?.name);
      }
      if (profile?.phone_number && typeof profile?.phone_number === 'string') {
        const result = parsePhoneNumber(profile?.phone_number);
        formik.setFieldValue('phone', parseInt(result?.nationalNumber, 10));
        formik.setFieldValue('country_code', result?.countryCallingCode);
      }
      if (profile?.profile) {
        formik.setFieldValue('profile', profile?.profile);
      } else {
        formik.setFieldValue('profile', 'https://react.pixelstrap.net/fastkart/assets/avatar.png')
      }
    }
  }, [profile]);

  return (
    <Row>
      <input
        type="file"
        onChange={(event) => {
          const file = event.currentTarget.files[0]; // Directly extract the file from the event
          setFieldValue(prevState => ({ ...prevState, attachments: file }));
        }}
      />
      {picture && (
        <img src={picture} alt="Uploaded profile" style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '60%'
        }}/>
      )}
      <div className='d-none'>
      <SimpleInputField
        nameList={[
          {
            name: 'profile',
            placeholder: t('EnterProfile'),
            toplabel: 'profile',
            colprops: { xs: 12 },
            require: 'true',
          },
        ]}
      />
      </div>
      <SimpleInputField
        nameList={[
          {
            name: 'name',
            placeholder: t('EnterName'),
            toplabel: 'Name',
            colprops: { xs: 12 },
            require: 'true',
          },
        ]}
      />
      <div className="country-input">
        <SimpleInputField
          nameList={[
            {
              name: 'phone',
              type: 'number',
              placeholder: t('EnterPhoneNumber'),
              require: 'true',
              toplabel: 'Phone',
              colprops: { xs: 12 },
              colclass: 'country-input-box',
            },
          ]}
        />
        <SearchableSelectInput
          nameList={[
            {
              name: 'country_code',
              notitle: 'true',
              inputprops: {
                name: 'country_code',
                id: 'country_code',
                options: AllCountryCode,
              },
            },
          ]}
        />
      </div>
      <Col xs={12}>
        <ModalFooter className="ms-auto justify-content-end save-back-button pt-0">
          <Btn
            className="btn btn-md btn-theme-outline fw-bold"
            title={t('Cancel')}
            onClick={() => setModal(false)}
          />
          <Btn
            className="btn-md fw-bold text-light theme-bg-color"
            type="submit"
            title={t('Submit')}
            loading={isLoading}
          />
        </ModalFooter>
      </Col>
    </Row>
  )
}

export default EmailPasswordForm
