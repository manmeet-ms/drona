"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

const tutorProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  subjects: z.string().min(2, "Subjects must be at least 2 characters"),
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be a positive number"),
});

type TutorProfileForm = z.infer<typeof tutorProfileSchema>;

export default function TutorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]); // Using any primarily for quick iteration, ideally specific interface should be reused

  const form = useForm<TutorProfileForm>({
    resolver: zodResolver(tutorProfileSchema) as any,
    defaultValues: {
      bio: "",
      subjects: "",
      hourlyRate: 0,
    },
  });

  const fetchData = async () => {
    try {
      const [profileRes, classesRes] = await Promise.all([
        axios.get("/api/tutors/profile"),
        axios.get("/api/tutor/classes"),
      ]);
console.log(profileRes,
classesRes);

      if (profileRes.data && profileRes.data.id) {
        form.reset({
          bio: profileRes.data.bio || "",
          subjects: profileRes.data.subjects ? profileRes.data.subjects.join(", ") : "",
          hourlyRate: profileRes.data.hourlyRate || 0,
        });
      }
      setClasses(classesRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: TutorProfileForm) => {
    try {
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
      {/* Notifications and Classes Tabs */}
      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Today's Classes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {classes.filter(c => new Date(c.createdAt) > new Date(Date.now() - 86400000)).length > 0 && (
              <Badge variant="destructive" className="ml-2 h-2 w-2 rounded-full p-0" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>Manage your scheduled classes</CardDescription>
            </CardHeader>
            <CardContent>
              {classes.filter((cls) => cls.status !== "COMPLETED").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-dashed border rounded-lg">
                  No active classes.
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.filter((cls) => new Date(cls.scheduledAt).getDate() === new Date().getDate()).map((cls) => (
                    <div
                      key={cls.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/tutor/classes/${cls.id}`)}
                    >
                      <div>
                        <h4 className="font-semibold">{cls.student.name} - {new Date(cls.scheduledAt).toLocaleString()}</h4>
                        <p className="text-sm text-muted-foreground">Status: {cls.status}</p>
                      </div>
                      <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/tutor/classes/${cls.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Class History</CardTitle>
              <CardDescription>View your past completed classes</CardDescription>
            </CardHeader>
            <CardContent>
              {classes.filter(c => c.status === "COMPLETED").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No completed classes yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {classes
                    .filter(c => c.status === "COMPLETED")
                    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                    .map((cls) => (
                      <div key={cls.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-muted/20">
                        <div>
                          <h4 className="font-semibold text-muted-foreground">{cls.student.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Completed on {new Date(cls.scheduledAt).toLocaleDateString()} at {new Date(cls.scheduledAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => router.push(`/tutor/classes/${cls.id}`)}>Review Details</Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Booking Activities</CardTitle>
              <CardDescription>New classes booked in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {classes.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 86400000)).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent notifications.
                </div>
              ) : (
                <div className="space-y-4">
                  {classes
                    .filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 86400000))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                        <div>
                          <p className="font-medium">New Class Booked!</p>
                          <p className="text-sm text-muted-foreground">
                            Parent booked a session for <strong>{cls.student.name}</strong> on {new Date(cls.scheduledAt).toLocaleString()}.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Booked {new Date(cls.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => router.push(`/tutor/classes/${cls.id}`)}>View</Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your public tutor profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell students about your teaching style and experience..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjects (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Math, Physics, Chemistry" {...field} />
                      </FormControl>
                      <FormDescription>
                        List the subjects you are qualified to teach
                      </FormDescription>
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
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  <IconDeviceFloppy className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>


    </div>
  );
}