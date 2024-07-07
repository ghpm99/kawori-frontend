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
    id: number;
    name: string;
    abbreviation: string;
    color: string;
    awakeningImage?: string;
    successionImage?: string;
};

const assetsClassData: AssetsClassData[] = [
    {
        id: 1,
        name: "Archer",
        abbreviation: "Arqueiro",
        color: '#4d8e66'
    },
    {
        id: 2,
        name: "Berserker",
        abbreviation: "Berserker",
        color: '#bc433b'
    },
    {
        id: 23,
        name: "Witch",
        abbreviation: "Bruxa",
        color: '#8b76d7'
    },
    {
        id: 4,
        name: "Dark Knight",
        abbreviation: "Cavaleira das Trevas",
        color: '#a166b9'
    },
    {
        id: 15,
        name: "Ranger",
        abbreviation: "Ca\u00e7adora",
        color: "#52a98d",
    },
    {
        id: 3,
        name: "Corsair",
        abbreviation: "Corsaria",
        color:'#3f7398'
    },
    {
        id: 20,
        name: "Tamer",
        abbreviation: "Domadora",
        color: '#43b5ca'
    },
    {
        id: 5,
        name: "Drakania",
        abbreviation: "Drakania",
        color: '#92abe4'
    },
    {
        id: 18,
        name: "Sorceress",
        abbreviation: "Feiticeira",
        color: '#7f69e1'
    },
    {
        id: 6,
        name: "Guardian",
        abbreviation: "Guardia",
        color:'#243852'
    },
    {
        id: 22,
        name: "Warrior",
        abbreviation: "Guerreiro",
        color: "#5f0000",
    },
    {
        id: 7,
        name: "Hashashin",
        abbreviation: "Hashashin",
        color: '#314f97'
    },
    {
        id: 8,
        name: "Kunoichi",
        abbreviation: "Kunoichi",
        color: '#689a94'
    },
    {
        id: 9,
        name: "Lahn",
        abbreviation: "Lahn",
        color: '#a64047'
    },
    {
        id: 19,
        name: "Striker",
        abbreviation: "Lutador",
        color: '#cc4d4d'
    },
    {
        id: 10,
        name: "Maehwa",
        abbreviation: "Maehwa",
        color: '#506ba4'
    },
    {
        id: 24,
        name: "Wizard",
        abbreviation: "Mago",
        color: '#4a6272'
    },
    {
        id: 26,
        name: "Maegu",
        abbreviation: "Me-gu",
        color:'#ffa8ef'
    },
    {
        id: 12,
        name: "Mystic",
        abbreviation: "Mistica",
        color: '#4c8ec0'
    },
    {
        id: 11,
        name: "Musa",
        abbreviation: "Musa",
        color: '#6e3913'
    },
    {
        id: 13,
        name: "Ninja",
        abbreviation: "Ninja",
        color: '#bf3e3e'
    },
    {
        id: 14,
        name: "Nova",
        abbreviation: "Nova",
        color:'#998758'
    },
    {
        id: 16,
        name: "Sage",
        abbreviation: "Sage",
        color:'#875023'
    },
    {
        id: 27,
        name: "Erudita",
        abbreviation: "Scholar",
        color: '#522824'
    },
    {
        id: 17,
        name: "Shai",
        abbreviation: "Shai",
        color: '#245237'
    },
    {
        id: 21,
        name: "Valkyrie",
        abbreviation: "Valquiria",
        color: '#a9844e'
    },
    {
        id: 25,
        name: "Woosa",
        abbreviation: "Wu-sa",
        color: '#767ae9'
    },
    {
        id: 28,
        name: "Do-Sa",
        abbreviation: "do-sa",
        color: '#92abe4'
    },
];

export const assetsClass = (classId: number): AssetsClassData => {
    const basicAsset = assetsClassData.find((item) => item.id === classId);
    if (!basicAsset){
        return null
    }

    basicAsset.awakeningImage = `/assets/class/awakening_${basicAsset.name.toLowerCase()}.jpg`;
    basicAsset.successionImage = `/assets/class/succession_${basicAsset.name.toLowerCase()}.jpg`;
    return basicAsset;
};
