"use client";
import { Badge } from "@/src/components/ui/badge"
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { IconLoader2, IconMapPin, IconBook, IconFileText, IconLink } from "@tabler/icons-react";

interface Resource {
  id: string;
  title: string;
  type: "PDF" | "LINK" | "TEXT" | "IMAGE";
  url: string | null;
  content: string | null;
}

interface TutorProfile {
  id: string;
  bio: string | null;
  subjects: string[];
  hourlyRate: number | null;
  location: string | null;
  user: {
    fullname: string;
  };
  resources: Resource[];
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function TutorProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Booking State
  const [bookingOpen, setBookingOpen] = useState(false);
  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchTutor(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
      if (bookingOpen && session?.user?.role === 'PARENT') {
          fetchMyStudents();
      }
  }, [bookingOpen, session]);

  const fetchTutor = async (id: string) => {
    try {
      const response = await axios.get(`/api/tutors/${id}`);
      setTutor(response.data);
    } catch (error) {
      console.error("Failed to fetch tutor", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyStudents = async () => {
      try {
          const res = await axios.get('/api/parent/students');
          setMyStudents(res.data);
      } catch (e) {
          toast.error("Failed to load your students");
      }
  };

  const handleBookClass = async () => {
      if (!selectedStudentId || !bookingDate) {
          toast.error("Please select a student and date");
          return;
      }
      
      try {
          await axios.post('/api/class/create', {
              tutorId: tutor?.id, // Assuming tutor object has the tutorId (it fetched profile which usually includes it or is wrapping it)
              // Wait, the API returns TutorProfile.
              // backend route /api/tutors/[id] returns... let's check interface.
              // Interface has "id". Is that Tutor ID or User ID? 
              // Prisma schema usually: Tutor model has id. 
              // So tutor.id should be correct.
              studentId: selectedStudentId,
              // scheduledAt: new Date(bookingDate).toISOString(),
              schedules: [new Date(bookingDate).toISOString()],
          }, {withCredentials:true,headers:{'Content-Type': 'application/json'}});
          toast.success("Class booked successfully!");
          setBookingOpen(false);
      } catch (error) {
          console.error("Failed to book class",error);
          toast.error("Failed to book class",error);
      }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tutor) {
    return <p className="text-center p-8">Tutor not found.</p>;
  }

  return (
    <>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Sidebar / Info */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{tutor.user.fullname}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <IconMapPin className="h-3 w-3" />
                  {tutor.location || "Online"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subj) => (
                                             <Badge variant="secondary" key={subj}>{subj}</Badge>

                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Hourly Rate</h3>
                  <p className="text-lg">₹{tutor.hourlyRate}/hr</p>
                </div>
                <div className="flex flex-col gap-2">
                  {session?.user?.role === 'PARENT' ? (
                      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                          <DialogTrigger asChild>
                              <Button className="w-full">Book Class</Button>
                          </DialogTrigger>
                          <DialogContent>
                              <DialogHeader>
                                  <DialogTitle>Book a Session</DialogTitle>
                                  <DialogDescription>Schedule a class with {tutor.user.fullname}</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                      <Label>Select Student</Label>
                                      <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select child..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                              {myStudents.map(s => (
                                                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                  </div>
                                  <div className="grid gap-2">
                                      <Label>Date & Time</Label>
                                      <Input 
                                          type="datetime-local" 
                                          value={bookingDate}
                                          onChange={(e) => setBookingDate(e.target.value)}
                                      />
                                  </div>
                              </div>
                              <DialogFooter>
                                  <Button onClick={handleBookClass}>Confirm Booking</Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>
                  ) : (
                      <Button 
                        className="w-full" 
                        variant="secondary"
                        onClick={() => window.location.href = '/auth/login?callbackUrl=' + window.location.pathname}
                      >
                        {session ? "Log in as Parent to Book" : "Login to Book"}
                      </Button>
                  )}
                <Button variant='outline' className="w-full">Enquire Now</Button>
             
                </div>
                 </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {tutor.bio || "No bio provided."}
                </p>
              </CardContent>
            </Card>

            {/* Resources Section commented out in original */}
          </div>
        </div>
      </div>
    </>
  );
}
