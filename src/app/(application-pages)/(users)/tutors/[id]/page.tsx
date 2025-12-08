"use client";

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

export default function TutorProfilePage() {
  const params = useParams();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTutor(params.id as string);
    }
  }, [params.id]);

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
                      <span
                        key={subj}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Hourly Rate</h3>
                  <p className="text-lg">₹{tutor.hourlyRate}/hr</p>
                </div>
                <Button className="w-full">Book Class</Button>
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

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Study materials shared by the tutor</CardDescription>
              </CardHeader>
              <CardContent>
                {tutor.resources.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No resources uploaded.</p>
                ) : (
                  <div className="space-y-3">
                    {tutor.resources.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {res.type === "LINK" ? (
                          <IconLink className="h-5 w-5 text-blue-500" />
                        ) : (
                          <IconFileText className="h-5 w-5 text-orange-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{res.title}</p>
                          {res.type === "LINK" && res.url && (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              {res.url}
                            </a>
                          )}
                          {res.type === "TEXT" && res.content && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {res.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
