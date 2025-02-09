import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Slider from 'react-slick';
import CustomHeading from '@/Components/Common/CustomHeading';
import Avatar from '@/Components/Common/Avatar';
import { placeHolderImage } from '../../../../Data/CommonPath';
import CategoryContext from '@/Helper/CategoryContext';
import { useTranslation } from '@/app/i18n/client';
import I18NextContext from '@/Helper/I18NextContext';
import { getHostApi } from '@/Utils/AxiosUtils';
import { useParams } from 'next/navigation';

const ProductSection2 = ({
  dataAPI,
  isHeadingVisible = false,
  classes = {},
  svgUrl,
}) => {
  const { filterCategory } = useContext(CategoryContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const [categoryData, setCategoryData] = useState([]);
  const [mapFilter, setMapFilter] = useState(null);
  const params = useParams();

  // Fetch categories data
  const fetchCategoriesData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?lang=${params?.lng}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error(`Error fetching categories data: ${res.statusText}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories data:', error);
      return [];
    }
  };

  // Fetch MapFilter data
  const fetchMapFilterData = async () => {
    try {
      const res = await fetch(`${getHostApi()}category`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error(`Error fetching MapFilter data: ${res.statusText}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching MapFilter data:', error);
      return [];
    }
  };

  // useQuery hook for fetching categories data
  const { data: categoriesData } = useQuery(['categories'], fetchCategoriesData, {
    refetchOnWindowFocus: false,
  });

  // useQuery hook for fetching MapFilter data
  const { data: mapFilterData } = useQuery(['category'], fetchMapFilterData, {
    refetchOnWindowFocus: false,
  });

  // Set category data when fetched
  useEffect(() => {
    if (categoriesData) {
      setCategoryData(categoriesData);
    }
  }, [categoriesData]);

  // Set MapFilter data when fetched
  useEffect(() => {
    if (mapFilterData) {
      setMapFilter(mapFilterData);
    }
  }, [mapFilterData]);

  return (
    <>
      {isHeadingVisible && (
        <CustomHeading
          customClass={''}
          title={dataAPI?.title}
          svgUrl={svgUrl}
          subTitle={dataAPI?.description}
        />
      )}

      <div className="category-slider-2 product-wrapper no-arrow">
        <Slider {...classes?.sliderOption}>
          {categoryData.map((elem) => {
            // if (mapFilter?.content?.show_categories[elem.categoryId]) {
              return (
                <div key={elem.categoryId} className="mb-3">
                  <Link
                    href={`/${i18Lang}/collections?category=${elem?.categoryId}`}
                    className={`category-box ${classes?.link} category-dark`}
                  >
                    <div>
                      <Avatar
                        data={{ original_url: elem?.original_url }}
                        placeHolder={placeHolderImage}
                        name={elem.name}
                      />
                      <h5 className="mt-3">{elem?.translations?.name || elem?.name}</h5>
                    </div>
                  </Link>
                </div>
              );
            // }
            // return null;
          })}
        </Slider>
      </div>
    </>
  );
};

export default ProductSection2;
