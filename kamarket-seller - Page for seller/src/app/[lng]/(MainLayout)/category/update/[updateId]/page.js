"use client";
import TableTitle from "@/Components/Table/TableTitle";
import CategoryForm from "@/Components/category/CategoryForm";
import TreeForm from "@/Components/category/TreeForm";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const CategoryUpdate = ({ params }) => {
  return (
    <>
      <Container fluid={true}>
        <Row>
          <Col xl="4">
            <Card>
              <CardBody>
                <TableTitle moduleName="Category" type={'product'} />
                <TreeForm type={'product'} />
              </CardBody>
            </Card>
          </Col>
          <Col xl="8">
            <Card><CardBody>
              <TableTitle moduleName="UpdateCategory" onlyTitle={true} />
              {params?.updateId && (
                <CategoryForm updateId={params?.updateId} type={'product'} />
              )}
            </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CategoryUpdate;