import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import UpdateStatus from './UpdateStatus'
import { Form, Formik } from 'formik'
import NumberTable from './NumberTable'

const OrderNumberTable = ({ moduleName, data, orderStatusData, orderStatus, edit, updateId }) => {
    return (
        <Container fluid={true}>
            <Row>
                <Col xs="12">
                    <Card>
                        <CardBody>
                            <div className="title-header">
                                <div className="d-flex align-items-center"><h5>{moduleName}</h5>

                                </div>
                                <Formik initialValues={{
                                    order_status: ''
                                }}>
                                    {({ values, setFieldValue }) => (
                                        <Form>
                                            <UpdateStatus setFieldValue={setFieldValue} orderStatusData={orderStatusData} updateId={updateId} orderStatus={orderStatus} />
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                            <NumberTable data={data} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default OrderNumberTable