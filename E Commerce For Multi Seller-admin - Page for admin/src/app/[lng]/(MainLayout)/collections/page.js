'use client'
import React from 'react'
import { Card, CardHeader, Col, Row, ListGroup, ListGroupItem, Button } from 'reactstrap'
import CollectionsContain from '@/Components/Collections'
import { useEffect, useState, useContext } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import I18NextContext from '@/Helper/I18NextContext'
import { useTranslation } from '@/app/i18n/client'
import { fetchAuthSession } from 'aws-amplify/auth'

const Media = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t } = useTranslation(i18Lang, 'common')
  const [categories, setCategories] = useState([])
  const searchParams = useSearchParams();
  const category = searchParams.get('category')
  const router = useRouter()
  console.log('categories', categories)

  const findById =  async (categories, id) => {
    for (let node of categories) {
      if (node?.id === id || node?.categoryId === id) {
          return node?.subcategories
      }

      if (node?.subcategories) {
        let found = await findById(node?.subcategories, id)
        if (found) return found
      }
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      const result = await response.json()
      const subcategories = await findById(result, category)
      console.log('subcategories', subcategories)
      setCategories(subcategories)
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    if (category) {
      fetchCategories();
    }
  }, [category]);

  return (
    <>
      <Row>
        <Col xs={3}>
        <Card
          style={{
            width: '100%'
          }}
        >
          <CardHeader>
            <div style={{
              fontSize: "calc(13px + 3 * (100vw - 320px) / 1600)",
              backgroundColor: "#f9f9f6",
              textAlign: "center",
              minWidth: "170px",
              padding: "20px 15px",
              textTransform: "capitalize",
              position: "relative",
              cursor: "pointer",
              color: "#4a5568",
              fontWeight: 600
            }}>{t('CategorySub')}</div>
          </CardHeader>
          <ListGroup flush>
            {categories?.map(subcategory => (
              <ListGroupItem key={subcategory.id} className="d-flex justify-content-between align-items-center">
                <span className="subcategory-name">{subcategory.name}</span>
                <Button color="primary" onClick={() => router.push(`/${i18Lang}/collections?category=${subcategory.id}`)}>
                  View
                </Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Card>
        </Col>
        <Col xs={9}>
          <CollectionsContain isattachment={true} />
        </Col>
      </Row>
    </>
  );
};

export default Media; // Ensure proper exporting of your component
