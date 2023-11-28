import { Card, Layout } from "antd";

import SingupForm from "components/signup";
import MenuHeader from "../../components/menuHeader";

const { Content } = Layout;

export default function RegisterPage() {
    return (
        <Layout
            style={{
                minHeight: "100vh",
                backgroundColor: "rgb(0, 0, 27, 0.8)",
            }}
        >
            <MenuHeader />
            <Content>
                <Layout
                    style={{
                        width: "100vw",
                        height: "90vh",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgb(0, 0, 27, 0)",
                    }}
                >
                    <div style={{ maxWidth: "50%" }}>
                        <Card title="Cadastrar">
                            <SingupForm />
                        </Card>
                    </div>
                </Layout>
            </Content>
        </Layout>
    );
}
