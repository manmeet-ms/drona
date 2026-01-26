import { z } from 'zod';

export const registerSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters."),
    email: z.string()
        .email("Invalid email address."),
    password: z.string()
        .min(8, "Password must be at least 8 characters."),
    role: z.enum(['PARENT', 'TUTOR'] as const),
    bio: z.string().optional(),
    experience: z.string().optional(),
    subjects: z.string().optional(),
    classesTaught: z.string().optional(),
    adhaarId: z.string().optional(),
    location: z.string().optional(),
});

// Export the inferred TypeScript type for type safety across the app
export type RegisterInput = z.infer<typeof registerSchema>;