import React, { useContext, useState, useEffect } from 'react'
import SimpleInputField from '../InputFields/SimpleInputField'
import SearchableSelectInput from '../InputFields/SearchableSelectInput'
import DescriptionInput from './DescriptionInput'
import SettingContext from '../../Helper/SettingContext'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'
import { Formik, Form } from 'formik'
import { PolicyGet, PolicyPost } from './logic';
import FormBtn from '../../Elements/Buttons/FormBtn'
import { Input, Row, Col } from 'reactstrap';

const BuyingGuide = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const { state } = useContext(SettingContext)
  const [data, setData] = useState(null)
  const [selectedOption, setSelectedOption] = useState('vi');

  const handleOptionChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedOption(selectedValue);
      console.log('Selected Option:', selectedValue);
  };

  useEffect(() => {
    const fetchData = async () => {
        const response = await PolicyGet({ action: 'BUYINGUIDE', language: selectedOption });
        setData(response);
    };

    fetchData();
  }, [selectedOption]);

  return (
    <>
    <Row className="align-items-center"> {/* Center vertically */}
      <Col xs="12" md="7" lg="8"> {/* 60% width on medium and larger screens */}
          <div className="title-header option-title">
              <h5>{t('Buying Guide')}</h5>
          </div>
      </Col>
      <Col xs="12" md="5" lg="4"> {/* 40% width on medium and larger screens */}
          <Input type="select" value={selectedOption} onChange={handleOptionChange}>
              <option value="" disabled>{t('Select a language')}</option>
              <option value="vi">{t('Vietnamese')}</option>
              <option value="en">{t('English')}</option>
              <option value="ko">{t('Korean')}</option>
              <option value="zh-CN">{t('Chinese')}</option>
          </Input>
      </Col>
    </Row>
    <br/>
    <Formik
      initialValues={{
        name: data?.name || '',
        action: 'BUYINGUIDE',
        language: selectedOption || '',
        // short_description: '',
        description: data?.description || '',
        // store_id: '',
      }}
      enableReinitialize={true}
      onSubmit={values => {
        PolicyPost(values)
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <SimpleInputField
            nameList={[
              { name: 'name', require: 'true', placeholder: t('EnterName') },
            //   {
            //     name: 'short_description',
            //     require: 'true',
            //     title: 'ShortDescription',
            //     type: 'textarea',
            //     rows: 3,
            //     placeholder: t('EnterShortDescription'),
            //     helpertext: '*Maximum length should be 300 characters.',
            //   },
            ]}
          />

          <DescriptionInput
            values={values}
            setFieldValue={setFieldValue}
            title={t('Description')}
            nameKey="description"
            errorMessage={'Descriptionisrequired'}
          />
          
          <FormBtn />
          {/* Searchable Select Input for Multi-Vendor Stores
          {state?.isMultiVendor && (
            <SearchableSelectInput
              nameList={[
                {
                  name: 'store_id',
                  title: 'Store',
                  require: 'true',
                  inputprops: {
                    name: 'store_id',
                    id: 'store_id',
                    options: StoreData || [],
                    close: true,
                  },
                },
              ]}
            />
          )} */}
        </Form>
      )}
    </Formik>
    </>
  )
}

export default BuyingGuide
