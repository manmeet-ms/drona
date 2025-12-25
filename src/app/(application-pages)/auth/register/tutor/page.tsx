'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/src/lib/validation/authSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/bkp.button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import Link from 'next/link';

export default function TutorRegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullname: '', email: '', password: '', role: 'TUTOR' }
    });

    const [file, setFile] = React.useState<File | null>(null);

    const onSubmit = async (data: RegisterInput) => {
        try {
            const formData = new FormData();
            formData.append('fullname', data.fullname);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('role', 'TUTOR');
            if (file) {
                formData.append('verificationDocument', file);
            }

            const response = await axios.post('/api/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("User created successfully:", response.data);
            router.push(`/auth/login/tutor`);
        } catch (error: any) {
            console.error("Registration failed:", error);
            // alert(error?.response?.data?.message || error?.message || "Registration failed due to server error.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Tutor Registration</CardTitle>
                    <CardDescription>Join as a tutor to start teaching</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input id="fullname" placeholder="Jane Doe" {...register('fullname')} />
                            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="tutor@example.com" {...register('email')} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="********" {...register('password')} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document">Identity Proof (Optional)</Label>
                            <Input
                                id="document"
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-muted-foreground">Upload a valid ID (Aadhaar, PAN, etc.)</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Register as Tutor'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-2">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/auth/login/tutor" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                    <Link href="/auth/register" className="text-sm text-muted-foreground hover:underline">
                        Back to Register Options
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
