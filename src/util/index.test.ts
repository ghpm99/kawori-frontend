import { formatMoney, formatterDate, formatterDetailedDate, formatterMonthYearDate, normalizeString, getSavedTheme, updateSearchParams } from "./index";

describe("formatMoney", () => {
    it("deve formatar valor positivo no padrão BRL com duas casas decimais", () => {
        const result = formatMoney(1234.56);
        expect(result).toBe("R$\u00a01.234,56");
    });

    it("deve formatar zero como R$ 0,00", () => {
        const result = formatMoney(0);
        expect(result).toBe("R$\u00a00,00");
    });

    it("deve formatar valores negativos com sinal de menos", () => {
        const result = formatMoney(-100);
        expect(result).toBe("-R$\u00a0100,00");
    });

    it("deve formatar valores com centavos corretamente", () => {
        const result = formatMoney(0.99);
        expect(result).toBe("R$\u00a00,99");
    });

    it("deve formatar valores grandes com separadores de milhar", () => {
        const result = formatMoney(1000000);
        expect(result).toBe("R$\u00a01.000.000,00");
    });
});

describe("formatterDate", () => {
    it("deve converter data ISO para formato pt-BR dd/mm/aaaa", () => {
        const result = formatterDate("2024-01-15");
        expect(result).toBe("15/01/2024");
    });

    it("deve lidar com datas em formato diferente fazendo fallback", () => {
        const result = formatterDate("2024-12-25");
        expect(result).toBe("25/12/2024");
    });
});

describe("formatterDetailedDate", () => {
    it("deve converter datetime ISO para formato pt-BR com hora", () => {
        const result = formatterDetailedDate("2024-01-15T10:30:00Z");
        expect(result).toMatch(/15\/01\/2024/);
        expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
});

describe("formatterMonthYearDate", () => {
    it("deve retornar data no formato MM/YYYY", () => {
        const result = formatterMonthYearDate("2024-06-15");
        expect(result).toBe("06/2024");
    });

    it("deve retornar janeiro corretamente", () => {
        const result = formatterMonthYearDate("2024-01-01");
        expect(result).toBe("01/2024");
    });
});

describe("normalizeString", () => {
    it("deve converter 'Class Name' para 'class-name'", () => {
        expect(normalizeString("Class Name")).toBe("class-name");
    });

    it("deve converter para lowercase", () => {
        expect(normalizeString("WARRIOR")).toBe("warrior");
    });

    it("deve retornar string vazia quando receber string vazia", () => {
        expect(normalizeString("")).toBe("");
    });
});

describe("getSavedTheme", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("deve retornar 'light' quando não há tema salvo no localStorage", () => {
        expect(getSavedTheme()).toBe("light");
    });

    it("deve retornar 'dark' quando o tema salvo é 'dark'", () => {
        localStorage.setItem("theme", "dark");
        expect(getSavedTheme()).toBe("dark");
    });

    it("deve retornar 'light' quando o tema salvo é 'light'", () => {
        localStorage.setItem("theme", "light");
        expect(getSavedTheme()).toBe("light");
    });

    it("deve retornar 'light' para valores inválidos no localStorage", () => {
        localStorage.setItem("theme", "invalid");
        expect(getSavedTheme()).toBe("light");
    });
});

describe("updateSearchParams", () => {
    it("deve chamar router.push com query string construída a partir dos filtros", () => {
        const router = { push: jest.fn() } as any;
        updateSearchParams(router, "/payments", { status: "open", page: "2" });
        expect(router.push).toHaveBeenCalledWith("/payments?status=open&page=2");
    });

    it("deve ignorar filtros com valor vazio ou falsy", () => {
        const router = { push: jest.fn() } as any;
        updateSearchParams(router, "/payments", { status: "open", tag: "", page: null });
        expect(router.push).toHaveBeenCalledWith("/payments?status=open");
    });

    it("deve chamar router.push sem query string quando todos filtros são vazios", () => {
        const router = { push: jest.fn() } as any;
        updateSearchParams(router, "/payments", { status: "", tag: "" });
        expect(router.push).toHaveBeenCalledWith("/payments");
    });
});
