import MenuHeader from "../../components/menuHeader";
import styles from "./Commands.module.scss";

const Commands = () => {
    return (
        <div className={styles["container"]}>
            <div className={styles["body"]}>
                <MenuHeader />
            </div>
        </div>
    );
};

export default Commands;
