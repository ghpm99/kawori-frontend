import Link from "next/link";

import AccountMenuInfo from "../accountMenuInfo";
import styles from "./MenuHeader.module.scss";
import useMenuHeader from "./useMenuHeader";
import Image from 'next/image'
import LogoImage from '@/public/logo.png'

export default function MenuHeader() {
    const context = useMenuHeader();

    return (
        <div className={styles["menu-header"]}>
            <div className={styles["menu"]}>
                <Link href="/" className={styles["menu-item"]}>
                    <Image alt='Logo' src={LogoImage} width={100}/>
                </Link>
            </div>
            <div className={styles["user-container"]}>
                <div></div>
                {context.status === "authenticated" ? (
                    <div className={styles["user-options"]}>
                        <AccountMenuInfo
                            user={{
                                avatar: context.data?.user?.image,
                                name: context.data?.user?.name ?? "",
                                email: context.data?.user?.email ?? "",
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles["user-options"]}>
                        <Link href="/signin">
                            <div className={styles["user-option"]}>Logar</div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
