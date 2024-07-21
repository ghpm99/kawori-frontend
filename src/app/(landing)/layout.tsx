import MenuHeader from "@/components/menuHeader";
import styles from "./landing.module.scss";
import { Footer } from "antd/lib/layout/layout";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className={styles["container"]}>
                <MenuHeader />
                <div className={styles["body"]}>
                    <div className={styles["internal-page"]}>{children}</div>
                </div>
            </div>
            <Footer style={{ textAlign: "center", boxShadow: "0 0 7px 1px rgba(0,0,0,.1)" }}>
                Sinta-se a vontade para entrar para
                <a target="_blank" href="https://discord.gg/fykNkXyn2r">
                    &nbsp;nossa comunidade&nbsp;
                </a>
                caso tenha alguma duvida ou sugestão!
            </Footer>
        </>
    );
};

export default LandingLayout;
