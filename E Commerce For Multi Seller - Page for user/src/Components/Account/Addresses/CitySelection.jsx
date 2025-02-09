import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { ModalFooter } from 'reactstrap';
import Btn from '@/Elements/Buttons/Btn';
import { post } from 'aws-amplify/api';
import * as Yup from 'yup';
import { fetchAuthSession } from 'aws-amplify/auth';
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import dvhcvn from '../../../app/api/dvhcvn/dvhcvn.json'

async function addAddress({ accessToken, values }) {
    return await post({
      apiName: 'kamarket',
      path: '/address',
      options: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: values,
      },
    }).response
  }

const CitySelection = ({setModal, editAddress}) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const { i18Lang } = useContext(I18NextContext)
    const { t } = useTranslation(i18Lang, 'common')

    // const { data: dvhcvn, isLoading, refetch } = useQuery([DvhcvnAPI], () => request({ url: DvhcvnAPI}),
    //   {
    //     enabled: false,
    //     refetchOnWindowFocus: false,
    //     select: res => res,
    //   }
    // )

  useEffect(() => {
    setCities(dvhcvn?.data)
  }, []);

//   console.log(Cookies.get('uat'))

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    street: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone number is required'),
    city: Yup.string().required('City is required'),
    district: Yup.string().required('District is required'),
    ward: Yup.string().required('Ward is required'),
  });

  const formik = useFormik({
    initialValues: {
      city: editAddress ? editAddress.city : '',
      district: editAddress ? editAddress.district : '',
      ward: editAddress ? editAddress.ward : '',
      phone: editAddress ? editAddress.phone : '',
      name: editAddress ? editAddress.name : '',
      street: editAddress ? editAddress.street : '',
    },
    validationSchema,
    onSubmit: async values => {
      // Handle form submission
      const token = await fetchAuthSession().catch(console.error)
      addAddress({
        accessToken: token?.tokens?.idToken?.toString(),
        values: {
          street: values.street,
          ward: values.ward,
          district: values.district,
          city: values.city,
          phone: values.phone,
          title: 'HOME',
          name: values.name,
        },
      })
        .then(res => {
          console.log('ADDED ADDRESS', res)
          setModal(false)
          // refresh the page
        //   router.replace(router.asPath)
        })
        // .then(console.log)
        .catch(console.error)
    }
  });

  const handleCityChange = e => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find(city => city.name === selectedCityId);
    console.log(selectedCity)
    if (selectedCity) {
      setDistricts(selectedCity.level2s);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }

    formik.setFieldValue('city', selectedCityId);
    formik.setFieldValue('district', '');
    formik.setFieldValue('ward', '');
  };

  const handleDistrictChange = e => {
    const selectedDistrictId = e.target.value;
    const selectedDistrict = districts.find(district => district.name === selectedDistrictId);

    if (selectedDistrict) {
      setWards(selectedDistrict.level3s);
    } else {
      setWards([]);
    }

    formik.setFieldValue('district', selectedDistrictId);
    formik.setFieldValue('ward', '');
  };

  return (
    <form onSubmit={formik.handleSubmit} className='form-address'>
      <div className='mb-3'>
        <label className="mb-3">{t('FullName')}*</label>
        <input
          type="text"
          name="name"
          className="form-control form-select-sm"
          placeholder={t('EnterFullName')}
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className="mb-3">{t('Address')}*</label>
        <input
          type="text"
          name="street"
          className="form-control form-select-sm"
          placeholder="Enter Address"
          onChange={formik.handleChange}
          value={formik.values.street}
          onBlur={formik.handleBlur}
        />
        {formik.touched.street && formik.errors.street && (
          <div className="error">{formik.errors.street}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className="mb-3">{t('Phone')}*</label>
        <input
          type="number"
          name="phone"
          className="form-control form-select-sm "
          placeholder="Enter Phone Number"
          onChange={formik.handleChange}
          value={formik.values.phone}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className="error">{formik.errors.phone}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className="mb-3">{t('City')}</label>
        <select
          className="form-control form-select-sm"
          id="city"
          aria-label=".form-select-sm"
          onChange={handleCityChange}
          value={formik.values.city}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled defaultValue>
            {t('Select City')}
          </option>
          {cities?.map(city => (
            <option key={city?.level1_id} value={city?.name}>
              {city?.name}
            </option>
          ))}
        </select>
        {formik.touched.city && formik.errors.city && (
          <div className="error">{formik.errors.city}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className="mb-3">{t('District')}</label>
        <select
          className="form-control form-select-sm"
          id="district"
          aria-label=".form-select-sm"
          onChange={handleDistrictChange}
          value={formik.values.district}
          disabled={!formik.values.city}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled defaultValue>
            {t('Select District')}
          </option>
          {districts?.map(district => (
            <option key={district?.level2_id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
        {formik.touched.district && formik.errors.district && (
          <div className="error">{formik.errors.district}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className="mb-3">{t('Ward')}</label>
        <select
          className="form-control form-select-sm"
          id="ward"
          aria-label=".form-select-sm"
          onChange={formik.handleChange}
          value={formik.values.ward}
          disabled={!formik.values.district}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled defaultValue>
            {t('Select Ward')}
          </option>
          {wards?.map(ward => (
            <option key={ward?.level3_id} value={ward.name}>
              {ward.name}
            </option>
          ))}
        </select>
        {formik.touched.ward && formik.errors.ward && (
          <div className="error">{formik.errors.ward}</div>
        )}
      </div>
        <ModalFooter className="ms-auto justify-content-end save-back-button">
          <Btn
            className="btn-md btn-theme-outline fw-bold"
            title="Cancel"
          />
          <Btn
            className="btn-md fw-bold text-light theme-bg-color"
            type="submit"
            title="Submit"
          />
        </ModalFooter>
    </form>
  );
};

export default CitySelection;