import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions={
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            

        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session:{strategy:"jwt" as const},
    callbacks:{
        async jwt({ token, account }: { token: any; account: any }) {
            if(account)token.accesstoken=account.access_token;
            return token;
        },
        async session({session,token}: { session: any; token: any }){
            session.accesstoken=token.accesstoken as string;
            return session;
        },
    },
};

const handler =NextAuth(authOptions);
export {handler as  GET, handler as POST};
