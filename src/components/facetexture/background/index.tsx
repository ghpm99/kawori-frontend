import { InboxOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
import { useSelector } from "react-redux";

import { updateBackgroundReducer } from "../../../store/features/facetexture";
import { RootState, useAppDispatch } from "../../../store/store";
import { db } from "../../../util/db";
import Styles from "./Background.module.scss";

const Background = () => {
    const facetextureStore = useSelector(
        (state: RootState) => state.facetexture,
    );
    const dispatch = useAppDispatch();

    const uploadNewBackground = async (file: RcFile) => {
        const firstBackground = (await db.background.toArray())[0];
        db.background.update(firstBackground.id ?? 0, {
            image: file,
        });
        const backgroundUrl = URL.createObjectURL(file);
        dispatch(updateBackgroundReducer(backgroundUrl));
    };

    return (
        <div className={Styles["background-container"]}>
            <h1>Background</h1>
            <div>
                <img src={facetextureStore.backgroundUrl} alt={"background"} />
                <ImgCrop showReset rotationSlider aspect={4 / 3}>
                    <Dragger
                        fileList={[]}
                        beforeUpload={uploadNewBackground}
                        maxCount={1}>
                        <div>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Clique ou arraste o arquivo para esta área para
                                fazer upload
                            </p>
                            <p className="ant-upload-hint">
                                Suporte para upload único
                            </p>
                        </div>
                    </Dragger>
                </ImgCrop>
            </div>
        </div>
    );
};

export default Background;
