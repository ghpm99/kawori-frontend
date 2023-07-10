import { Card } from "antd";

import { formatMoney } from "../../../util";
import styles from "./cards.module.scss";

interface ICardsProps {
    loading: boolean;
    countPayment: number;
    amountPayment: number;
    amountPaymentOpen: number;
    amountPaymentClosed: number;
}

const Cards = (props: ICardsProps) => {
    return (
        <div className={styles["cards-container"]}>
            <Card
                title="Total de pagamentos"
                style={{ flexGrow: "1" }}
                loading={props.loading}>
                {props.countPayment}
            </Card>
            <Card
                title="Valor total de pagamentos"
                style={{ flexGrow: "1" }}
                loading={props.loading}>
                {formatMoney(props.amountPayment)}
            </Card>
            <Card
                title="Valor total de pagamentos em aberto"
                style={{ flexGrow: "1" }}
                loading={props.loading}>
                {formatMoney(props.amountPaymentOpen)}
            </Card>
            <Card
                title="Valor total de pagamentos fechados"
                style={{ flexGrow: "1" }}
                loading={props.loading}>
                {formatMoney(props.amountPaymentClosed)}
            </Card>
        </div>
    );
};

export default Cards;
