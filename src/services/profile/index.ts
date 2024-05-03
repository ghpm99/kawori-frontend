import { createControlledGetRequest } from "../request";

export interface IUser {
    id: number;
    name: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    last_login: string;
    date_joined: string;
    image?: string;
}

export const userDetailsControlledRequest = createControlledGetRequest<undefined, IUser>(
    "profile/userDetails",
    "/profile",
    {},
    true,
);
