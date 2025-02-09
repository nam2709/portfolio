import Image from "next/image";
import { Input, Label } from "reactstrap";
import AttachmentsDropdown from "./AttachmentDropdown";

const AttachmentData = ({ state, dispatch, multiple, attachmentsDatas, refetch, redirectToTabs }) => {
    const attachmentsData = attachmentsDatas && attachmentsDatas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // useEffect(() => {
    //     refetch();
    // }, []);
    // Selecting images from media modal
    const ChoseImages = (e, item) => {
        if (multiple) {
            if (!e.target.checked) {
                let removeDuplicatesImage = [...state.selectedImage]
                removeDuplicatesImage = removeDuplicatesImage.filter((el) => {
                    return el.id !== item.id
                })
                dispatch({
                    type: "SELECTEDIMAGE", payload: state?.selectedImage?.length > 0 ? removeDuplicatesImage : [item]
                })
            } else {
                dispatch({
                    type: "SELECTEDIMAGE", payload: state?.selectedImage?.length > 0 ? [...state.selectedImage, item] : [item]
                })
            }
        } else {
            dispatch({ type: "SELECTEDIMAGE", payload: [item] })
        }
    };
    return (
        <>
            {attachmentsData?.map((elem, i) => (
                <div key={i}>
                    <div className="library-box">
                        <Input type="checkbox" id={elem?.imageId} checked={state?.selectedImage?.length > 0 ? multiple ? state.selectedImage.forEach((result) => (result?.imageId == elem?.imageId ? true : false)) : state.selectedImage.every((item) => item?.imageId == elem?.imageId) : false} onChange={(e) => ChoseImages(e, elem)} />
                        <Label htmlFor={elem?.imageId}>
                            <div className="ratio ratio-1x1">
                                <Image src={elem?.url} className="img-fluid" alt={elem?.imageId} width={100} height={100} />
                            </div>
                            {!redirectToTabs && <AttachmentsDropdown id={elem?.imageId} />}
                        </Label>
                    </div>
                </div>
            ))}
        </>
    );
};

export default AttachmentData;