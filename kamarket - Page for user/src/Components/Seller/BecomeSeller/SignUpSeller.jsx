import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Row } from 'reactstrap';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';
import dvhcvn from '../../../app/api/dvhcvn/dvhcvn.json'
import ConfirmationModalVendor from '@/Components/Common/ConfirmationModalVendor';
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  street: Yup.string().required('Street is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  city: Yup.string().required('City is required'),
  district: Yup.string().required('District is required'),
  ward: Yup.string().required('Ward is required'),
});

async function addVendor({ accessToken, values }) {
    return await post({
      apiName: 'kamarket',
      path: '/vendors',
      options: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: values,
      },
    }).response
  }

const SignUpSeller = () => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [modal, setModal] = useState(false)

  useEffect(() => {
    setCities(dvhcvn?.data)
  }, []);


  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      street: '',
      slug: '',
      description: '',
      city: '',
      district: '',
      ward: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // Xử lý logic khi biểu mẫu được gửi đi
      const session = await fetchAuthSession().catch(console.error)
        addVendor({
        accessToken: session?.tokens?.idToken.toString(),
        values: {
            street: values.street,
            name: values.name,
            phone: values.phone,
            email: values.email,
            slug: values.slug,
            description: values.description,
            ward: values.ward,
            district: values.district,
            city: values.city,
        },
        })
        .then(res => {  
          // refresh the page
          // router.replace(router.asPath)
        setModal(!modal)
        })
        .catch(
          console.error
        )
    },
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
    <>
    <form onSubmit={formik.handleSubmit} className='sign-up-seller form-address'>
        <div className='d-center'>
          <Col xs={12} md={8} >
            <Row>
              <Col xs={12} md={6} className="form-group">
                  <label htmlFor="name">Tên Shop Của Bạn</label>
                  <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder='Tên Shop Của Bạn...'
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className={
                      formik.touched.name && formik.errors.name ? 'error' : ''
                  }
                  />
                  {formik.touched.name && formik.errors.name && (
                  <div className="error-message">{formik.errors.name}</div>
                  )}
              </Col>
              <Col xs={12} md={6} className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='exemple@gmail.com'
                onChange={formik.handleChange}
                value={formik.values.email}
                className={
                  formik.touched.email && formik.errors.email ? 'error' : ''
                }
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}
            </Col>

            <Col xs={12} md={6} className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="number"
                id="phone"
                name="phone"
                placeholder='Số điện thoại của shop'
                onChange={formik.handleChange}
                value={formik.values.phone}
                className={
                  formik.touched.phone && formik.errors.phone ? 'error' : ''
                }
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error-message">{formik.errors.phone}</div>
              )}
            </Col>
            <Col xs={12} md={6} className="form-group">
              <label htmlFor="address">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                placeholder='Lựa chọn đường dẫn độc đáo cho Shop của bạn VD: Black-Computer-686868'
                onChange={formik.handleChange}
                value={formik.values.slug}
                className={
                  formik.touched.slug && formik.errors.slug ? 'error' : ''
                }
              />
              {formik.touched.slug && formik.errors.slug && (
                <div className="error-message">{formik.errors.slug}</div>
              )}
            </Col>
            <Col xs={12} className="form-group">
              <label htmlFor="address">Giới Thiệu Về Shop</label>
              <input
                type="textarea"
                id="description"
                name="description"
                placeholder='Mô tả ngắn gọn về shop của bạn'
                onChange={formik.handleChange}
                value={formik.values.description}
                className={
                  formik.touched.description && formik.errors.description ? 'error' : ''
                }
              />
              {formik.touched.description && formik.errors.description && (
                <div className="error-message">{formik.errors.description}</div>
              )}
            </Col>
            <Col xs={12} md={4} className="form-group">
              <label className="mb-3">City</label>
              <select
                className="form-control form-select-sm"
                id="city"
                aria-label=".form-select-sm"
                onChange={handleCityChange}
                value={formik.values.city}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled defaultValue>
                  Select City
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
            </Col>

            <Col xs={12} md={4} className="form-group">
              <label className="mb-3">District</label>
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
                  Select District
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
            </Col>

            <Col xs={12} md={4} className="form-group">
              <label className="mb-3">Ward</label>
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
                  Select Ward
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
            </Col>
            <Col xs={12} className="form-group">
              <label htmlFor="address">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder='Số nhà - Đường'
                onChange={formik.handleChange}
                value={formik.values.street}
                className={
                  formik.touched.street && formik.errors.street ? 'error' : ''
                }
              />
              {formik.touched.street && formik.errors.street && (
                <div className="error-message">{formik.errors.street}</div>
              )}
            </Col>
            </Row>
          </Col>
        </div>
        <div className='d-center'>
          <button className='w-150' type="submit">Trở Thành Người Bán Hàng</button>
        </div>
    </form>
    <ConfirmationModalVendor 
      modal={modal}
      setModal={setModal}
      textConfirm="VendorSubmit"
    />
    </>
  );
};

export default SignUpSeller;