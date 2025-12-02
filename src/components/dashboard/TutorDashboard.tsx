
"use client";
import { Label } from "@/src/components/ui/label";
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
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const tutorProfileSchema = z.object({
  bio: z.string().optional(),
  subjects: z.string().min(1, "At least one subject is required"), // Comma separated string for input
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be positive"),
});

type TutorProfileForm = z.infer<typeof tutorProfileSchema>;

export default function TutorDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<TutorProfileForm>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: "",
      subjects: "",
      hourlyRate: 0,
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
        });
      }
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TutorProfileForm) => {
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Placeholder for Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>Mark attendance for your classes</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex gap-4 items-end">
             <div className="grid w-full max-w-sm items-center gap-1.5">
               <Label htmlFor="qr-token">Scan QR / Enter Token</Label>
               <Input 
                 id="qr-token" 
                 placeholder="Paste token here..." 
                 onChange={(e) => {
                   // In a real app, a QR scanner would fill this
                   // For now, we just manually enter the token
                 }} 
               />
             </div>
             <Button onClick={() => toast.info("QR Scanning implemented via API /api/attendance/scan")}>
               Mark Attendance
             </Button>
           </div>
           <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Upcoming classes list will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
