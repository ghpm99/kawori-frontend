import { Breadcrumb, Layout } from "antd"
import { useRouter } from "next/router"

import Loading from "@/components/facetexture/loading"
import LoginHeader from "@/components/loginHeader/Index"
import MenuAdmin from "@/components/menuAdmin/Index"
import Styles from "./rank.module.scss"

const { Header, Content } = Layout;
export const FACETEXTURE_MESSAGE_REF = "facetexture-message-ref";

function Rank() {
    const router = useRouter();

    return (
        <Layout className={Styles["container"]}>
            <MenuAdmin selected={["rank"]} />
            <Layout>
                <Header className={Styles["header"]}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={Styles["breadcrumb"]}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Rank de classes</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={Styles["container-toolkit"]}>

                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

Rank.auth = {
    role: "user",
    loading: <Loading />,
    unauthorized: "/signin",
};

export default Rank;
