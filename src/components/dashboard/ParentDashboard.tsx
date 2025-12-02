"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useProfile } from "@/src/providers/ProfileProvider";
import { Loader2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type CreateStudentForm = z.infer<typeof createStudentSchema>;

interface Student {
  id: string;
  name: string;
  studentId: string;
}

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { switchToStudent } = useProfile();

  const form = useForm<CreateStudentForm>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/parent/students");
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateStudentForm) => {
    try {
      await axios.post("/api/parent/students", data);
      toast.success("Student created successfully");
      form.reset();
      fetchStudents();
    } catch (error) {
      toast.error("Failed to create student");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Student Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Student
            </CardTitle>
            <CardDescription>Create a profile for your child</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Rahul Kumar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="****" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Children
            </CardTitle>
            <CardDescription>Manage profiles and switch views</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No students added yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {student.studentId}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchToStudent(student.id)}
                    >
                      Switch View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
