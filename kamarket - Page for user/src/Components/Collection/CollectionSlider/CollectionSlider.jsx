import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import { collectionCategorySlider } from '../../../../Data/SliderSettingsData';
import WrapperComponent from '../../Common/WrapperComponent';
import Avatar from '../../Common/Avatar';
import CategoryContext from '@/Helper/CategoryContext';
import { placeHolderImage } from '../../../../Data/CommonPath';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useCustomSearchParams } from '@/Utils/Hooks/useCustomSearchParams';
import { getHostApi } from '@/Utils/AxiosUtils';

const CollectionSlider = ({ filter, setFilter }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { filterCategory } = useContext(CategoryContext);

  const [mapFilter, setMapFilter] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const paramslng = useParams();
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?lang=${paramslng?.lng}`, { method: 'GET' });
      if (!res.ok) throw new Error(`Error fetching categories data: ${res.statusText}`);
      const data = await res.json();
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
    if (categories) {
      setCategoriesData(categories);
    }
  }, [categories]);

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

  // Ensure categoriesData is an array
  const categoryArray = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <WrapperComponent colProps={{ xs: 12 }}>
      <div className="slider-7_1 no-space shop-box no-arrow">
        <Slider {...collectionCategorySlider}>
          {categoryArray.map((elem) => {
            // if (mapFilter?.content?.show_categories[elem.categoryId]) {
              return (
                <div key={elem.categoryId} style={{ width: '100%', display: 'inline-block' }}>
                  <div className={`category-box shop-category-box ${activeCategory === elem.categoryId ? 'active' : ''}`}>
                    <div onClick={() => handleCategoryClick(elem.categoryId)} className="shop-category-image">
                      <Avatar
                        data={{ original_url: elem.original_url }}
                        placeHolder={placeHolderImage}
                        name={elem.name}
                      />
                      <h5 className="mt-3">{elem?.translations?.name || elem?.name}</h5>
                    </div>
                  </div>
                </div>
              );
            // } else {
            //   return null;
            // }
          })}
        </Slider>
      </div>
    </WrapperComponent>
  );
};

export default CollectionSlider;
