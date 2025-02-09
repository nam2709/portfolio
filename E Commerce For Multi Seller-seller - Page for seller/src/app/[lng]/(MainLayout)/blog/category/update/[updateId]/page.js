'use client'
import TableTitle from '@/Components/Table/TableTitle';
import CategoryForm from '@/Components/category/CategoryForm';
import TreeForm from '@/Components/category/TreeForm';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

const UpdateBlogCategory = ({ params }) => {
    return (
        <>
            <Container fluid={true}>
                <Row >
                    <Col xl="4">
                        <Card>
                            <CardBody>
                                <TreeForm type={'post'} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="8">
                        <Card><CardBody>
                            {params?.updateId && (
                                <>
                                    <TableTitle moduleName="UpdateCategory" onlyTitle={true} />
                                    <CategoryForm updateId={params?.updateId} type={'post'} />
                                </>
                            )}
                        </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default UpdateBlogCategory