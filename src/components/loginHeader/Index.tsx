
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popover } from "antd";

import Link from "next/link";

import S from "./Login.module.scss";

export default function LoginHeader() {
    const { data, status } = {
        data: { user: { name: "test" } },
        status: "authenticated",
    };

    const content = (
        <div>
            <div>{data?.user?.name}</div>
            <Button>Deslogar</Button>
        </div>
    );

    return (
        <div className={S.layout}>
            {status === "authenticated" ? (
                <Popover content={content} title="Conta" className={S["user"]}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {data?.user?.name}
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
