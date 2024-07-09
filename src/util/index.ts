import dayjs from "dayjs";

export const FACETEXTURE_MESSAGE_REF = "facetexture-message-ref";

export const formatMoney = (
    amount: number,
    decimalCount = 2,
    decimal = ".",
    thousands = ",",
    currencySymbol = "R$",
) => {
    if (typeof Intl === "object") {
        return new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
        }).format(amount);
    }
    // Fallback if Intl is not present.
    try {
        const negativeSign = amount < 0 ? "-" : "";
        const amountNumber = Math.abs(Number(amount) || 0).toFixed(decimalCount);
        const i = parseInt(amountNumber, 10).toString();
        const j = i.length > 3 ? i.length % 3 : 0;
        return (
            currencySymbol +
            negativeSign +
            (j ? i.substr(0, j) + thousands : "") +
            i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
            (decimalCount
                ? decimal +
                  Math.abs(parseInt(amountNumber) - parseInt(i))
                      .toFixed(decimalCount)
                      .slice(2)
                : "")
        );
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return amount;
};

export const formatterDate = (dateString: string) => {
    let date = new Date(dateString + " GMT-0300");
    if (isNaN(date.getTime())) {
        date = new Date(dateString);
    }
    return date.toLocaleDateString("pt-BR");
};

export const formatterDetailedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
};

export const formatterMonthYearDate = (dateString: string) => {
    return dayjs(dateString).format("MM/YYYY");
};

export type AssetsClassData = {
    awakeningImage?: string;
    successionImage?: string;
};

export const assetsClass = (className: string): AssetsClassData => {
    const normalizedName = className
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const awakeningImage = `public/assets/awakening_${normalizedName}.jpg`;
    const successionImage = `public/assets/succession_${normalizedName}.jpg`;
    return {
        awakeningImage,
        successionImage,
    };
};
