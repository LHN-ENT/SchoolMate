import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        // token.sub is the user's unique ID from the provider
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub ?? '',      // Add this line to include the user's ID in session.user
        name: token.name ?? '',
        email: token.email ?? '',
        image: token.picture ?? '',
      }
      return session
    },
    async redirect({ baseUrl }) {
      return baseUrl + '/dashboard'
    },
  },
  debug: true,
})
