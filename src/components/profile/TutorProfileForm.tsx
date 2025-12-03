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
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";

const tutorProfileSchema = z.object({
  bio: z.string().optional(),
  subjects: z.string().min(1, "At least one subject is required"), // Comma separated string for input
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
  location: z.string().optional(),
});

type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

export default function TutorProfileForm() {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: "",
      subjects: "",
      hourlyRate: 0,
      location: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/tutors/profile");
      if (response.data && response.data.id) {
        form.reset({
          bio: response.data.bio || "",
          subjects: response.data.subjects ? response.data.subjects.join(", ") : "",
          hourlyRate: response.data.hourlyRate || 0,
          location: response.data.location || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TutorProfileFormValues) => {
    try {
      // Convert comma-separated subjects string to array
      const subjectsArray = data.subjects.split(",").map((s) => s.trim()).filter((s) => s !== "");
      
      await axios.post("/api/tutors/profile", {
        ...data,
        subjects: subjectsArray,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Profile</CardTitle>
        <CardDescription>Update your public profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects</FormLabel>
                  <FormControl>
                    <Input placeholder="Math, Physics, Chemistry" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of subjects</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500" {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <IconDeviceFloppy className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
