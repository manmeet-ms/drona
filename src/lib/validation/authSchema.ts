import { z } from 'zod';

export const registerSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters."),
    email: z.string()
        .email("Invalid email address."),
    password: z.string()
        .min(8, "Password must be at least 8 characters."),
    role: z.enum(['PARENT', 'TEACHER'] as const),
});

// Export the inferred TypeScript type for type safety across the app
export type RegisterInput = z.infer<typeof registerSchema>;