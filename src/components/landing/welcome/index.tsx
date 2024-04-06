import { Typography } from "antd";
import styles from "./welcome.module.scss";

const Welcome = () => {
    return (
        <div className={styles["intro-text"]}>
            <Typography.Title level={1}>Bem vindo a Kawori!</Typography.Title>
            <Typography.Title level={2}>
                A Kawori é uma plataforma de personalização de tela de seleção de personagens para Black Desert Online.
            </Typography.Title>
        </div>
    );
};

export default Welcome;
