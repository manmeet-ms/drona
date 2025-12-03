
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
import { IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";

const tutorProfileSchema = z.object({
  bio: z.string().optional(),
  subjects: z.string().min(1, "At least one subject is required"), // Comma separated string for input
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
});

type TutorProfileForm = z.infer<typeof tutorProfileSchema>;

export default function TutorDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
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
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
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
