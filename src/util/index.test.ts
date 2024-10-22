import { formatMoney, formatterDate, formatterDetailedDate, formatterMonthYearDate, normalizeString } from "./index";

describe("Utility Functions", () => {
    describe("formatMoney", () => {
        it("should format money correctly with default parameters", () => {
            expect(formatMoney(1234567.89)).toBe("R$1,234,567.89");
        });

        it("should format money correctly with custom parameters", () => {
            expect(formatMoney(1234567.89, 2, ".", ",", "$")).toBe("$1,234,567.89");
        });

        it("should handle negative amounts correctly", () => {
            expect(formatMoney(-1234567.89)).toBe("R$-1,234,567.89");
        });

        it("should handle zero correctly", () => {
            expect(formatMoney(0)).toBe("R$0.00");
        });
    });

    describe("formatterDate", () => {
        it("should format date correctly", () => {
            expect(formatterDate("2023-10-05")).toBe("05/10/2023");
        });

        it("should handle invalid date string", () => {
            expect(formatterDate("invalid-date")).toBe("Invalid Date");
        });
    });

    describe("formatterDetailedDate", () => {
        it("should format detailed date correctly", () => {
            expect(formatterDetailedDate("2023-10-05T14:48:00.000Z")).toBe("05/10/2023 11:48");
        });

        it("should handle invalid date string", () => {
            expect(formatterDetailedDate("invalid-date")).toBe("Invalid Date");
        });
    });

    describe("formatterMonthYearDate", () => {
        it("should format month and year correctly", () => {
            expect(formatterMonthYearDate("2023-10-05")).toBe("10/2023");
        });

        it("should handle invalid date string", () => {
            expect(formatterMonthYearDate("invalid-date")).toBe("Invalid Date");
        });
    });

    describe("normalizeString", () => {
        it("should normalize string correctly", () => {
            expect(normalizeString("Hello World")).toBe("hello-world");
        });

        it("should handle empty string", () => {
            expect(normalizeString("")).toBe("");
        });
    });
});
