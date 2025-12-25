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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useProfile } from "@/src/providers/ProfileProvider";
import { IconLoader2, IconUserPlus, IconUsers, IconCalendarPlus, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import { bookClass, searchTutors } from "@/src/app/actions/booking";
import { useSession } from "next-auth/react";

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

interface Tutor {
  id: string;
  hourlyRate: number;
  subjects: string[];
  user: {
    fullname: string;
  };
}

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { switchToStudent } = useProfile();
  const session = useSession();

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tutorResults, setTutorResults] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [bookingDate, setBookingDate] = useState("");

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

  const handleTutorSearch = async () => {
    const res = await searchTutors(searchQuery);
    if (res.tutors) {
      // @ts-ignore - Booking API return type needs to be inferred or cast properly for strict TS, but for now we map relevant fields
      setTutorResults(res.tutors as unknown as Tutor[]);
    }
  };

  const handleBookClass = async () => {
    if (!selectedStudentId || !selectedTutor || !bookingDate || !session.data?.user.id) return;

    const date = new Date(bookingDate);
    const res = await bookClass(session.data.user.id, selectedStudentId, selectedTutor.id, date);

    if (res.success) {
      toast.success("Class booked successfully!");
      setBookingDialogOpen(false);
      setSelectedTutor(null);
      setBookingDate("");
      setSearchQuery("");
      setTutorResults([]);
    } else {
      toast.error(res.error || "Booking failed");
    }
  };

  const openBooking = (studentId: string) => {
    setSelectedStudentId(studentId);
    setBookingDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Student Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUserPlus className="h-5 w-5" />
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
                        <Input placeholder="Shivkumar Batalvi" {...field} />
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
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <IconUsers className="h-5 w-5" />
              Your Children
            </CardTitle>
            <CardDescription>Manage profiles and switch views</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <IconLoader2 className="h-6 w-6 animate-spin" />
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
                    className="flex flex-col justify-between rounded-lg border p-4 gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => switchToStudent(student.id)}
                      >
                        Switch View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => openBooking(student.id)}
                      >
                        <IconCalendarPlus className="w-4 h-4 mr-2" />
                        Book Class
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book a Class</DialogTitle>
            <DialogDescription>Find a tutor and schedule a session.</DialogDescription>
          </DialogHeader>

          {!selectedTutor ? (
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="icon" onClick={handleTutorSearch}>
                  <IconSearch className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {tutorResults.map(tutor => (
                  <div key={tutor.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedTutor(tutor)}>
                    <div>
                      <p className="font-medium">{tutor.user.fullname}</p>
                      <p className="text-xs text-muted-foreground">{tutor.subjects.join(", ")}</p>
                    </div>
                    <Button size="sm" variant="ghost">Select</Button>
                  </div>
                ))}
                {tutorResults.length === 0 && searchQuery && (
                  <p className="text-center text-sm text-muted-foreground py-4">No tutors found.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md mb-4">
                <span className="font-medium">Selected: {selectedTutor.user.fullname}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTutor(null)}>Change</Button>
              </div>

              <div className="space-y-2">
                <FormLabel>Select Date & Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedTutor && (
              <Button onClick={handleBookClass}>Confirm Booking</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
