import { createBasicAuth } from "./auth";

describe("createBasicAuth", () => {
    it("deve gerar string base64 de 'user:pass'", () => {
        const result = createBasicAuth("user", "pass");
        const expected = Buffer.from("user:pass").toString("base64");
        expect(result).toBe(expected);
    });

    it("deve codificar corretamente caracteres especiais", () => {
        const result = createBasicAuth("admin@test.com", "p@ss!w0rd");
        const expected = Buffer.from("admin@test.com:p@ss!w0rd").toString("base64");
        expect(result).toBe(expected);
    });

    it("deve gerar string diferente para credenciais diferentes", () => {
        const result1 = createBasicAuth("user1", "pass1");
        const result2 = createBasicAuth("user2", "pass2");
        expect(result1).not.toBe(result2);
    });

    it("deve lidar com strings vazias", () => {
        const result = createBasicAuth("", "");
        const expected = Buffer.from(":").toString("base64");
        expect(result).toBe(expected);
    });
});
