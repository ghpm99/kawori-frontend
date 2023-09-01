export interface pagination {
    current_page: number
    total_pages: number
    has_previous: boolean
    has_next: boolean
}

type PageAuth = {
    role: string
    loading: JSX.Element
    unauthorized: string
}

type PagePusher = {
    name: string
}

<<<<<<< HEAD
type NextPageCustom<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
=======
type NextPageCustom<P = {}, IP = P> = NextPage<P, IP> & {
>>>>>>> dev
    auth?: PageAuth
    pusher?: PagePusher
}
