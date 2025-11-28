import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/src/lib/prisma'; // Your singleton Prisma client
import bcrypt from 'bcryptjs';

// Define the NextAuth options object
export const authOptions: NextAuthOptions = {
    // 1. Adapter: Connect NextAuth to your PostgreSQL database via Prisma
    adapter: PrismaAdapter(prisma),

    // 2. Providers: Define the authentication methods
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            // Define the fields expected for login
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            // This is the core login function where you check the password hash
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // 2a. Find the user in PostgreSQL
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    // Ensure you select the hashedPassword for comparison
                    select: { id: true, email: true, fullname: true, password: true, role: true },
                });

                if (!user || !user.password) {
                    return null; // User not found or no password set
                }

                // 2b. Compare the provided password with the stored hash
                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (isMatch) {
                    // 2c. Successful login: Return the user object
                    // (Note: Do NOT return the hashedPassword here!)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.fullname,
                        role: user.role, // Attach the role here for use in callbacks
                    };
                } else {
                    return null; // Password mismatch
                }
            },
        }),
        // You would add GoogleProvider, etc., here if needed later
    ],

    // 3. Callbacks: Inject the custom `role` into the session object
    callbacks: {
        // This runs when a JWT is created (on login)
        jwt: async ({ token, user }) => {
            if (user) {
                // Attach the user's role to the JWT token
                token.role = user.role;
            }
            return token;
        },
        // This runs when a session is created (on useSession())
        session: async ({ session, token }) => {
            if (session.user) {
                // Attach the role from the token to the session object for client-side access
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    // 4. Session Configuration
    session: {
        strategy: 'jwt', // Use JWT for session management
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // 5. Pages (Optional but recommended to use custom pages)
    pages: {
        signIn: '/login', // Redirects unauthenticated users to your custom login page
        // error: '/auth/error',
    },

    // 6. Secret
    secret: process.env.NEXTAUTH_SECRET, // Requires the secret key in .env
};
