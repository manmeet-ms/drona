'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/src/lib/validation/authSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

export default function RegistrationPage() {
    const router = useRouter();
    const { 
        register, 
        handleSubmit, 
        setValue,
        formState: { errors, isSubmitting } 
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullname: '', email: '', password: '', role: 'PARENT' }
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            const response = await axios.post('/api/auth/register', data);
            console.log("User created successfully:", response.data);
            router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
        } catch (error: any) {
            console.error("Registration failed:", error);
            alert(error?.response?.data?.message || error?.message || "Registration failed due to server error.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Sign up to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input id="fullname" placeholder="John Doe" {...register('fullname')} />
                            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="********" {...register('password')} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(val: any) => setValue('role', val)} defaultValue="PARENT">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PARENT">Parent</SelectItem>
                                    <SelectItem value="TEACHER">Teacher</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="/auth/login" className="text-blue-600 hover:underline">
                            Sign in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
