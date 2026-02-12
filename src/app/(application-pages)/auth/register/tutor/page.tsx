'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/src/lib/validation/authSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button'; // Fixed import (user had bkp.button)
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import Link from 'next/link';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SUBJECTS } from "@/src/constants/subjects";

interface City {
    id: string;
    name: string;
    state: string;
}

export default function TutorRegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullname: '', email: '', password: '', role: 'TUTOR', phoneNumber: '', subjects: [] }
    });

    const [docFile, setDocFile] = React.useState<File | null>(null);
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [location, setLocation] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    useEffect(() => {
        // Fetch Indian cities
        const fetchCities = async () => {
             try {
                 const res = await axios.get('https://raw.githubusercontent.com/nshntarora/Indian-Cities-JSON/master/cities.json');
                 // The JSON is an array of objects
                 const cityList = (res.data as Array<{name: string, state: string}>).map((c, i) => ({
                     id: `${c.name}-${i}`,
                     name: c.name,
                     state: c.state
                 }));
                 // Sort by name
                 cityList.sort((a: City, b: City) => a.name.localeCompare(b.name));
                 setCities(cityList);
             } catch (e) {
                 console.error("Failed to fetch cities", e);
             }
        };
        fetchCities();
    }, []);

    const onSubmit = async (data: RegisterInput) => {
        try {
            const formData = new FormData();
            formData.append('fullname', data.fullname);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('role', 'TUTOR');
            
            if (data.bio) formData.append('bio', data.bio);
            if (data.experience) formData.append('experience', data.experience);
            if (data.subjects && data.subjects.length > 0) formData.append('subjects', JSON.stringify(data.subjects));
            if (data.classesTaught) formData.append('classesTaught', data.classesTaught);
            if (data.adhaarId) formData.append('adhaarId', data.adhaarId);
            if (location) formData.append('location', location);

            if (docFile) {
                formData.append('verificationDocument', docFile);
            }
            if (photoFile) {
                formData.append('profilePhoto', photoFile);
            }

            const response = await axios.post('/api/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("User created successfully:", response.data);
            router.push(`/auth/login/tutor`);
        } catch (error: unknown) {
            console.error("Registration failed:", error);
            let msg = "Registration failed.";
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                msg = error.response.data.message;
            } else if (error instanceof Error) {
                msg = error.message;
            }
            alert(msg);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 py-8">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Tutor Registration</CardTitle>
                    <CardDescription>Join as a tutor to start teaching</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" type="tel" placeholder="+91 9876543210" {...register('phoneNumber')} />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="********" {...register('password')} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="adhaarId">Adhaar ID (Optional)</Label>
                                <Input id="adhaarId" placeholder="XXXX-XXXX-XXXX" {...register('adhaarId')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="bio">Bio</Label>
                             <Textarea id="bio" placeholder="Tell us about yourself..." {...register('bio')} />
                        </div>

                         <div className="space-y-2">
                             <Label htmlFor="experience">Experience</Label>
                             <Textarea id="experience" placeholder="Describe your teaching experience..." {...register('experience')} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2 flex flex-col">
                                <Label className='mb-2'>Subjects</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {selectedSubjects.length > 0
                                                ? `${selectedSubjects.length} selected`
                                                : "Select subjects..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search subject..." />
                                            <CommandList>
                                                <CommandEmpty>No subject found.</CommandEmpty>
                                                <CommandGroup className="max-h-[200px] overflow-auto">
                                                    {SUBJECTS.map((subject) => (
                                                        <CommandItem
                                                            key={subject}
                                                            value={subject}
                                                            onSelect={(currentValue) => {
                                                                // Toggle selection
                                                                const isSelected = selectedSubjects.includes(currentValue);
                                                                let newSubjects;
                                                                if (isSelected) {
                                                                    newSubjects = selectedSubjects.filter(s => s !== currentValue);
                                                                } else {
                                                                    newSubjects = [...selectedSubjects, currentValue];
                                                                }
                                                                setSelectedSubjects(newSubjects);
                                                                setValue('subjects', newSubjects, { shouldValidate: true });
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedSubjects.includes(subject) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {subject}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedSubjects.map((subject) => (
                                        <Badge key={subject} variant="secondary" className="mr-1">
                                            {subject}
                                            <button
                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const newSubjects = selectedSubjects.filter((s) => s !== subject);
                                                        setSelectedSubjects(newSubjects);
                                                        setValue('subjects', newSubjects, { shouldValidate: true });
                                                    }
                                                }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onClick={() => {
                                                    const newSubjects = selectedSubjects.filter((s) => s !== subject);
                                                    setSelectedSubjects(newSubjects);
                                                    setValue('subjects', newSubjects, { shouldValidate: true });
                                                }}
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                {errors.subjects && <p className="text-red-500 text-sm">{errors.subjects.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="classesTaught">Classes Range</Label>
                                <Input id="classesTaught" placeholder="Class 1-5, 6-10, etc." {...register('classesTaught')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <Label>Location (City)</Label>
                             {/* Radix UI Select Integration */}
                             <Select onValueChange={(val) => {
                                 setLocation(val);
                                 setValue('location', val); 
                             }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {cities.length === 0 && <SelectItem value="loading" disabled>Loading cities...</SelectItem>}
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={city.name}>
                                            {city.name}, {city.state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="profilePhoto">Profile Photo</Label>
                                <Input
                                    id="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="document">Identity Proof (Optional)</Label>
                                <Input
                                    id="document"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-muted-foreground">Upload a valid ID (Aadhaar, PAN, etc.)</p>
                            </div>
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
