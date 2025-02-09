import React, { useContext, useState, useEffect } from 'react';// Ensure you have axios installed or use fetch API
import CartSidebar from './CartSidebar';
import { Col, Table } from 'reactstrap';
import CartData from './CartData';
import CartContext from '@/Helper/CartContext';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import NoDataFound from '../Common/NoDataFound';
import emptyImage from '../../../public/assets/svg/empty-items.svg';

const ShowCartData = () => {
  const { cartProducts } = useContext(CartContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');

  const [vendorNames, setVendorNames] = useState({});
  const groupedByVendor = cartProducts?.reduce((acc, product) => {
    const vendorId = product?.product?.GSI1PK.slice(7);
    if (!acc[vendorId]) {
      acc[vendorId] = [];
    }
    acc[vendorId].push(product);
    console.log('acc', acc)
    return acc;
  }, {});

  useEffect(() => {
    const fetchVendorNames = async () => {
      if (groupedByVendor) {
      const vendorIds = Object.keys(groupedByVendor);
      console.log('vendorIds', vendorIds)
      const vendorInfoPromises = vendorIds?.map(vendorId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`).then(response => response.json()) // Correctly handle the JSON response
        .then(data => ({
          [vendorId]: data?.name // Assuming the response has a 'name' field
        }))
      );
      console.log('vendorInfoPromises', vendorInfoPromises)

      try {
        const results = await Promise.all(vendorInfoPromises);
        const newVendorNames = results.reduce((acc, current) => ({
          ...acc,
          ...current
        }), {});

        setVendorNames(newVendorNames);
      } catch (error) {
        console.error('Failed to fetch vendor names:', error);
      }
      }
    };

    if (groupedByVendor && Object.keys(groupedByVendor).length > 0) {
      fetchVendorNames();
    }
  }, [cartProducts]);

  return (
    <> {/* Added single parent element */}
      {groupedByVendor && Object.keys(groupedByVendor).length > 0 ? (
        <>
          <Col xxl={9} xl={8}>
            {groupedByVendor && Object.keys(groupedByVendor)?.map((vendorId) => (
              <div key={vendorId} className="cart-table">
                <h3>{vendorNames[vendorId] || vendorId}</h3> {/* Display the vendor name or ID if name is not fetched */}
                <br></br>
                <div className="table-responsive">
                  <Table className="table">
                    <tbody>
                      {groupedByVendor[vendorId]?.map((item, index) => (
                        <CartData elem={item} key={index} />
                      ))}
                    </tbody>
                  </Table>
                  <br></br>
                </div>
              </div>
            ))}
          </Col>
          <CartSidebar />
        </>
      ) : (
        <NoDataFound
          data={{
            customClass: 'no-data-added',
            imageUrl: emptyImage,
            title: 'No Items Added',
            description:
              'Có vẻ như chưa có gì được thêm vào giỏ hàng của bạn. Khám phá các danh mục nếu bạn muốn.',
            height: 50,
            width: 50,
          }}
        />
      )}
    </>
  );
}

export default ShowCartData;
