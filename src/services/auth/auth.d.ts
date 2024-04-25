interface ILoginForm {
    username: string
    password: string
    remember: boolean
    captchaToken: string
}

interface IUser {
    tokens: {
        refresh: string
        access: string
        api_token?: string
    }
    remember: boolean
}

interface IUserDetailsApi {
    username: string
    name: string
    last_name: string
    user_type: string
    partner_id?: number
}

interface IChangePasswordRequest {
    new_password: string
    re_new_password: string
}
