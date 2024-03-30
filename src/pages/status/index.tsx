import MenuHeader from "../../components/menuHeader";
import styles from "./Status.module.scss";

export default function Status() {
    return (
        <div className={styles["container"]}>
            <div className={styles["body"]}>
                <MenuHeader />
            </div>
        </div>
    );
}
