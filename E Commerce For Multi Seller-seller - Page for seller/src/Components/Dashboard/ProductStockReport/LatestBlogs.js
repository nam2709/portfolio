import { Col, Row } from "reactstrap"
import DashboardWrapper from "../DashboardWrapper"
import { blog } from "../../../Utils/AxiosUtils/API";
import { useQuery } from "@tanstack/react-query";
import request from "../../../Utils/AxiosUtils";
import Avatar from "../../CommonComponent/Avatar";
import { placeHolderImage } from "../../../Data/CommonPath";
import { dateFormate } from "../../../Utils/CustomFunctions/DateFormate";

const LatestBlogs = () => {
    const { data } = useQuery([blog], () => request({ url: blog, params: { status: 1, paginate: 2 } }), {
        refetchOnWindowFocus: false, select: (data) => data?.data?.data,
    });
    return (
        <DashboardWrapper classes={{ title: "LatestBlogs" }}>
            <Row>
                {data?.slice(0, 2)?.map((elem, i) => (
                    <Col xs={6} key={i}>
                        <div className="blog-box">
                            <a href="#javascript" className="blog-img">
                                <Avatar data={elem?.blog_thumbnail} customeClass={"img-fluid"} noPrevClass={true} placeHolder={placeHolderImage} name={elem?.title} width={278} height={180} />
                            </a>
                            <div className="blog-content">
                                <a href="#javascript">{elem?.title}</a>
                                <h6>{dateFormate(elem?.created_at)}</h6>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </DashboardWrapper>
    )
}

export default LatestBlogs