'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import Link from 'next/link';
import { User, GraduationCap, School } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Drona</CardTitle>
          <CardDescription>Choose your login type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login/parent" className="block">
            <Button variant="outline" className="w-full h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
              <User className="h-6 w-6" />
              Login as Parent
            </Button>
          </Link>
          
          <Link href="/auth/login/tutor" className="block">
            <Button variant="outline" className="w-full h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
              <GraduationCap className="h-6 w-6" />
              Login as Tutor
            </Button>
          </Link>

          <Link href="/auth/login/student" className="block">
            <Button variant="outline" className="w-full h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
              <School className="h-6 w-6" />
              Login as Student
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
