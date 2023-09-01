import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { fetchUserDetails, signinService } from "../../../services/auth";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Do whatever you want here, before the request is passed down to `NextAuth`
    const providers = [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const tokenRes = await signinService(credentials?.username ?? "", credentials?.password ?? "");

                if (tokenRes.status !== 200) {
                    return null;
                }
                const token = await tokenRes.data.token;
                const res = await fetchUserDetails(token);

                const user = await res.data;
                user.token = token;
                // If no error and we have user data, return it
                if (res.status === 200 && user) {
                    return user;
                }
                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ];

    const pages = {
        signIn: "/signin",
        signOut: "/signout",
        verifyRequest: "/auth/verify-request",
        newUser: "/auth/new-user",
    };

    const callbacks = {
        async session({ session, user, token }: any) {
            session.accessToken = token.userSession;
            session.user.username = token.username;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.isStaff = token.isStaff;
            session.user.isActive = token.isActive;
            session.user.isSuperuser = token.isSuperuser;
            session.user.lastLogin = token.lastLogin;
            session.user.dateJoined = token.dateJoined;
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }: any) {
            if (user !== undefined) {
                token.userSession = user.token;
                token.username = user.username;
                token.firstName = user.first_name;
                token.lastName = user.last_name;
                token.isStaff = user.is_staff;
                token.isActive = user.is_active;
                token.isSuperuser = user.is_superuser;
                token.lastLogin = user.last_login;
                token.dateJoined = user.date_joined;
            }
            return token;
        },
    };

    return await NextAuth(req, res, {
        providers,
        pages,
        callbacks,
    });
}
