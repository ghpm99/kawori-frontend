import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popover } from "antd";

import Link from "next/link";

import S from "./Login.module.scss";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signout } from "@/lib/features/auth";
import { RootState } from "@/lib/store";

export default function LoginHeader() {
    const { user, status } = useAppSelector((state: RootState) => state.auth);

    const dispatch = useAppDispatch();

    const handleSignout = () => {
        dispatch(signout());
    };

    const content = (
        <div>
            <div>{user?.name}</div>
            <Button onClick={handleSignout}>Deslogar</Button>
        </div>
    );

    return (
        <div className={S.layout}>
            {status === "authenticated" ? (
                <Popover content={content} title="Conta" className={S["user"]}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {user?.name}
                </Popover>
            ) : (
                <div className={S.buttons}>
                    <Button type="primary" className={S.button}>
                        <Link href="/signin">Sign in</Link>
                    </Button>
                    <Button type="default" className={S.button}>
                        Sign up
                    </Button>
                </div>
            )}
        </div>
    );
}
