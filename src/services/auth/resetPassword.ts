import { apiAuth } from "@/services/auth";

export const requestPasswordReset = (email: string) => {
    return apiAuth.post<{ msg: string }>("password-reset/request/", { email });
};

export const validateResetToken = (token: string) => {
    return apiAuth.get<{ msg: string }>("password-reset/validate/", {
        params: { token },
    });
};

export const confirmPasswordReset = (token: string, newPassword: string) => {
    return apiAuth.post<{ msg: string }>("password-reset/confirm/", {
        token,
        new_password: newPassword,
    });
};
