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
import { Checkbox } from "@/src/components/ui/checkbox";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { format, addDays, getDay, setHours, setMinutes } from "date-fns";
import { cn } from "@/src/lib/utils";
import { IconLoader2, IconMapPin, IconCalendar } from "@tabler/icons-react";

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Recurring State
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [time, setTime] = useState("10:00");

  const weekdays = [
      { label: "Sun", value: 0 },
      { label: "Mon", value: 1 },
      { label: "Tue", value: 2 },
      { label: "Wed", value: 3 },
      { label: "Thu", value: 4 },
      { label: "Fri", value: 5 },
      { label: "Sat", value: 6 },
  ];

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

  const generateSchedule = () => {
    if (!time) return [];
    const [hours, minutes] = time.split(':').map(Number);
    let dates: Date[] = [];

    if (!isRecurring) {
        if (!date) return [];
        const d = new Date(date);
        d.setHours(hours, minutes, 0, 0);
        dates.push(d);
    } else {
        // Generate next 4 weeks (30 days)
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const current = addDays(today, i);
            if (selectedWeekdays.includes(getDay(current))) {
                const d = new Date(current);
                d.setHours(hours, minutes, 0, 0);
                dates.push(d);
            }
        }
    }
    return dates;
  };

  const handleBookClass = async () => {
    const schedules = generateSchedule();

    if (!selectedStudentId) {
        return toast.error("Please select a student");
    }
    if (schedules.length === 0) {
        return toast.error("Please select valid dates/time");
    }
      
    try {
        await axios.post('/api/class/create', {
            tutorId: tutor?.id, 
            studentId: selectedStudentId,
            schedules: schedules.map(d => d.toISOString()),
        }, {withCredentials:true,headers:{'Content-Type': 'application/json'}});
        
        toast.success(`Successfully booked ${schedules.length} class(es)!`);
        setBookingOpen(false);
    } catch (error) {
        console.error("Failed to book class",error);
        toast.error("Failed to book class");
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

                                  <div className="flex items-center space-x-2 my-2">
                                      <Checkbox 
                                          id="recurring" 
                                          checked={isRecurring} 
                                          onCheckedChange={(checked: boolean) => setIsRecurring(checked as boolean)}
                                      />
                                      <Label htmlFor="recurring" className="font-medium cursor-pointer">Recurring Schedule? (Next 30 days)</Label>
                                  </div>

                                  {!isRecurring ? (
                                      <div className="grid gap-2">
                                          <Label>Date</Label>
                                          <Popover>
                                              <PopoverTrigger asChild>
                                                  <Button
                                                      variant={"outline"}
                                                      className={cn(
                                                          "w-full justify-start text-left font-normal",
                                                          !date && "text-muted-foreground"
                                                      )}
                                                  >
                                                      <IconCalendar className="mr-2 h-4 w-4" />
                                                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                  </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0">
                                                  <Calendar
                                                      mode="single"
                                                      selected={date}
                                                      onSelect={setDate}
                                                      initialFocus
                                                  />
                                              </PopoverContent>
                                          </Popover>
                                      </div>
                                  ) : (
                                      <div className="grid gap-2">
                                          <Label>Select Days</Label>
                                          <div className="flex flex-wrap gap-2">
                                              {weekdays.map((day) => (
                                                  <div 
                                                      key={day.value}
                                                      onClick={() => {
                                                          setSelectedWeekdays(prev => 
                                                              prev.includes(day.value) 
                                                                  ? prev.filter(d => d !== day.value)
                                                                  : [...prev, day.value]
                                                          )
                                                      }}
                                                      className={cn(
                                                          "w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-colors text-sm",
                                                          selectedWeekdays.includes(day.value) 
                                                              ? "bg-primary text-primary-foreground border-primary"
                                                              : "hover:bg-accent"
                                                      )}
                                                  >
                                                      {day.label}
                                                  </div>
                                              ))}
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1">
                                              Classes will be created for these days for the next month.
                                          </p>
                                      </div>
                                  )}

                                  <div className="grid gap-2">
                                      <Label>Time</Label>
                                      <Input 
                                          type="time" 
                                          value={time} 
                                          onChange={(e) => setTime(e.target.value)} 
                                          className="w-full"
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
