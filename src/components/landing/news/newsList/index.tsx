import { List } from "antd";
import { NewsProps } from "..";
import Link from "next/link";
import { formatterDate } from "@/util";

const NewsList = ({ data }: { data: NewsProps[] }) => {
    return (
        <List
            header={<strong>Novidades</strong>}
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Link href={item.url}>
                        [{formatterDate(item.first_publication_date)}]{" - "}
                        {item.title}
                    </Link>
                </List.Item>
            )}
        />
    );
};

export default NewsList;
