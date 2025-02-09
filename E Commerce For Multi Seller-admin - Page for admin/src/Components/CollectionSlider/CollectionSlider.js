import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import { collectionCategorySlider } from './SliderSettingsData';
import WrapperComponent from './WrapperComponent';
import Avatar from './Avatar';
import CategoryContext from '@/Helper/CategoryContext';
import { placeHolderImage } from './CommonPath';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCustomSearchParams } from '@/Utils/Hooks/useCustomSearchParams';
import { getHostApi } from '@/Utils/AxiosUtils';
import './CollectionSlider.css'

const CollectionSlider = ({ filter, setFilter, testCategory }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { filterCategory } = useContext(CategoryContext);
  const [categoryArray, setCategoryArray] = useState([]);
  const [mapFilter, setMapFilter] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  console.log('categoriesData', categoriesData)

  const params = useSearchParams();
  const router = useRouter();
  const categoryId = params.get('category');
  const [attribute, price, rating, sortBy, field, layout] = useCustomSearchParams([
    'attribute',
    'price',
    'rating',
    'sortBy',
    'field',
    'layout',
  ]);

  // Fetch categories data from API
  const fetchCategoriesData = async () => {
    try {
      const res = await fetch(`${process.env.API_URL}/categories`, { method: 'GET' });
      if (!res.ok) throw new Error(`Error fetching categories data: ${res.statusText}`);
      const data = await res.json();
      console.log('fetchCategoriesData', data)
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Fetch category data from API
  const fetchCategoryData = async () => {
    try {
      const res = await fetch(`${getHostApi()}category`, { method: 'GET' });
      if (!res.ok) throw new Error(`Error fetching category data: ${res.statusText}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Fetch initial categories data using react-query
  const { data: categories, refetch: refetchCategories } = useQuery(
    ['categories'],
    fetchCategoriesData,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch initial category data using react-query
  const { data: category, refetch: refetchCategory } = useQuery(
    ['category'],
    fetchCategoryData,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    refetchCategories();
    refetchCategory();
  }, []);

  useEffect(() => {
    if (categories && !testCategory) {
      setCategoriesData(categories);
    } else if (categories && testCategory) {
      setCategoriesData([testCategory, ...categories]);
    }
  }, [categories, testCategory]);  

  useEffect(() => {
    if (category) {
      setMapFilter(category);
    }
  }, [category]);

  useEffect(() => {
    setActiveCategory(categoryId);
  }, [categoryId]);

  // Handle category click to set active category and navigate
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    router.push(`/${i18Lang}/collections?category=${categoryId}`);
  };

  useEffect(() => {
    if (Array.isArray(categoriesData)) {
      setCategoryArray(categoriesData);
    } else {
      setCategoryArray([]);
    }
    console.log('categoryArray', categoriesData);
  }, [categoriesData]);

  return (
    <WrapperComponent colProps={{ xs: 12 }}>
      <div className="slider-7_1 no-space shop-box no-arrow" style={{backgroundColor: "white"}}>
        <Slider {...collectionCategorySlider}>
          {categoryArray.map((elem) => {
              return (
                <div key={elem.categoryId} style={{ width: '100%', display: 'inline-block' }}>
                  <div className={`category-box shop-category-box ${activeCategory === elem.categoryId ? 'active' : ''}`}>
                    <div onClick={() => handleCategoryClick(elem.categoryId)} className="shop-category-image">
                      <Avatar
                        data={{ original_url: elem.original_url }}
                        placeHolder={placeHolderImage}
                        name={elem.name}
                      />
                      <h5 className="mt-3">{t(elem.name)}</h5>
                    </div>
                  </div>
                </div>
              );
          })}
        </Slider>
      </div>
    </WrapperComponent>
  );
};

export default CollectionSlider;
