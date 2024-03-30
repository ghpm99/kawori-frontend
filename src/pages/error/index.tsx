import { Card, Layout, Typography } from "antd"

import MenuHeader from "../../components/menuHeader"

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function ErrorPage() {
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
                        <Card title="Error">
                            <Title level={4}>Ocorreu um erro ao processar sua requisição.</Title>
                            <Paragraph>Tente novamente mais tarde...</Paragraph>
                            <Paragraph>Isso é uma tela de erro e é tudo o que eu sei sobre.</Paragraph>
                            <Paragraph>
                                Caso o problema persista sinta-se a vontade para comunicar o problema através do e-mail:
                                <a href="mailto:kawori_suporte@hotmail.com">kawori_suporte@hotmail.com</a>
                            </Paragraph>
                        </Card>
                    </div>
                </Layout>
            </Content>
        </Layout>
    );
}
