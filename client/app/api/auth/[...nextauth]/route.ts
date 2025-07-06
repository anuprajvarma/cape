import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_DEVELOPMENT!
          : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret:
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET_DEVELOPMENT!
          : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
