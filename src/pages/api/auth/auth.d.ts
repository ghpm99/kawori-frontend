interface ISession extends NextAuth.Session {
	accessToken?: string
	user: {
        name?: string
        email?: string
        image?: string
		username?: string
		firstName?: string
		lastName?: string
		isStaff?: boolean
		isActive?: boolean
		isSuperuser?: boolean
		lastLogin?: string
		dateJoined?: string
	}
}
