"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { IconLoader2, IconBook, IconCalendar } from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";

interface ClassSession {
  id: string;
  scheduledAt: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  student: {
    id: string;
    name: string;
  };
}

export default function TutorClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/tutor/classes");
      setClasses(response.data);
    } catch (error) {
      toast.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Manage your upcoming and past classes</p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconBook className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-muted-foreground">Scheduled classes will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <IconCalendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Student: {cls.student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cls.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={cls.status === "COMPLETED" ? "default" : cls.status === "CANCELLED" ? "destructive" : "secondary"}>
                  {cls.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
