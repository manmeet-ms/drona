"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { IconLoader2, IconBook, IconCalendar, IconQrcode } from "@tabler/icons-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Homework {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  class: {
    tutor: {
      user: {
        fullname: string;
      };
    };
  };
}

interface ClassSession {
  id: string;
  scheduledAt: string;
  tutor: {
    user: {
      fullname: string;
    };
  };
}

interface StudentData {
  student: {
    name: string;
    age?: number;
    school?: string;
    aspirations?: string;
    interests?: string[];
  };
  homeworks: Homework[];
  classes: ClassSession[];
}

export default function StudentDashboard() {
  const [data, setData] = useState<StudentData | null>(null);
  const session = useSession()
  console.log(session);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    age: 0,
    school: '',
    aspirations: '',
    interests: [] as string[],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("/api/student/dashboard");
      setData(response.data);
      // Initialize profile form data
      if (response.data.student) {
        setProfileData({
          age: response.data.student.age || 0,
          school: response.data.student.school || '',
          aspirations: response.data.student.aspirations || '',
          interests: response.data.student.interests || [],
        });
      }
    } catch (error) {
      toast.error("Failed to fetch student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put('/api/student/profile', profileData);
      toast.success("Profile updated!");
      setIsEditing(false);
      fetchDashboard(); // Refresh data
    } catch (e) {
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

  if (!data) {
    return <p className="text-center p-8">Failed to load data.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Profile Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.data?.user.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here is your learning dashboard.
          </p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
              <DialogDescription>Tell us more about yourself!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input 
                  type="number" 
                  value={profileData.age} 
                  onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input 
                  value={profileData.school} 
                  onChange={(e) => setProfileData({...profileData, school: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Aspirations</Label>
                <Textarea 
                  value={profileData.aspirations} 
                  onChange={(e) => setProfileData({...profileData, aspirations: e.target.value})} 
                  placeholder="What do you want to be?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Upcoming Classes
            </CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {data.classes.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming classes.</p>
            ) : (
              <div className="space-y-4">
                {data.classes.map((cls) => (
                  <div key={cls.id} className="rounded-lg border p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(cls.scheduledAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tutor: {cls.tutor.user.fullname}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const res = await axios.post('/api/attendance/generate', { classId: cls.id });
                          alert(`Class Code: ${res.data.token}\n(Show this to tutor)`);
                        } catch (e) {
                          toast.error("Failed to generate Code");
                        }
                      }}
                    >
                      <IconQrcode className="h-4 w-4 mr-2" />
                      Show Code
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBook className="h-5 w-5" />
              Pending Homework
            </CardTitle>
            <CardDescription>Assignments to complete</CardDescription>
          </CardHeader>
          <CardContent>
            {data.homeworks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending homework.</p>
            ) : (
              <div className="space-y-4">
                {data.homeworks.map((hw) => (
                  <div key={hw.id} className="rounded-lg border p-3">
                    <p className="font-medium">{hw.title}</p>
                    {hw.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {hw.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : "No due date"} • Tutor: {hw.class.tutor.user.fullname}
                    </p>
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
