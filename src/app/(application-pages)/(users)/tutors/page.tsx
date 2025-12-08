"use client";
import { Button } from "@/src/components/ui/button";
import {
  ButtonGroup
} from "@/src/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import Masonry from '@mui/lab/Masonry';
import { IconArrowRight, IconLoader2, IconMapPin, IconMessage2, IconPhone, IconSearch, IconShare } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/src/components/ui/badge";
interface Tutor {
  id: string;
  bio: string | null;
  subjects: string[];
  hourlyRate: number | null;
  location: string | null;
  user: {
    fullname: string;
    phoneNumber: string | null;
  };
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (subject) params.append("subject", subject);
      if (location) params.append("location", location);

      // const response = await axios.get(`/api/tutors?${params.toString()}`);
      const response = await axios.get(`/api/tutors`);

      
      setTutors(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Failed to fetch tutors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTutors();
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Find a Tutor</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Subject (e.g. Math)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Location (e.g. Delhi)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button type="submit">
            <IconSearch className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <IconLoader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : tutors.length === 0 ? (
          <p className="text-center text-muted-foreground">No tutors found.</p>
        ) : (
          // <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          //   {tutors.map((tutor) => (
          //     <Link href={`/tutors/${tutor.id}`} key={tutor.id}>
          //       <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
          //         <CardHeader>
          //           <CardTitle>{tutor.user.fullname}</CardTitle>
          //           <CardDescription className="flex items-center gap-1">
          //             <IconMapPin className="h-3 w-3" />
          //             {tutor.location || "Online/Not specified"}
          //           </CardDescription>
          //         </CardHeader>
          //         <CardContent>
          //           <div className="flex flex-wrap gap-2 mb-4">
          //             {tutor.subjects.map((subj) => (
          //               <span
          //                 key={subj}
          //                 className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
          //               >
          //                 {subj}
          //               </span>
          //             ))}
          //           </div>
          //           <p className="text-sm text-muted-foreground line-clamp-3">
          //             {tutor.bio || "No bio available."}
          //           </p>
          //           <div className="mt-4 font-semibold">
          //             ₹{tutor.hourlyRate}/hr
          //           </div>
          //         </CardContent>
          //       </Card>
          //     </Link>
          //   ))}
          // </div>
          <Masonry spacing={1.5} columns={{ xs: 1, sm: 2, md:3 }}>

            {tutors.map((tutor) => (
              <Link href={`/tutors/${tutor.id}`} key={tutor.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className='flex justify-between items-center' >{tutor.user.fullname} 
                      {/* <IconShare className='size-4' stroke={1.75}/> */}
                      <span>₹{tutor.hourlyRate}/hr</span> 
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <IconMapPin className="h-3 w-3" />
                      {tutor.location || "Online/Not specified"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tutor.subjects.map((subj) => (
                        <Badge variant="secondary"  key={subj}>{subj}</Badge>
                      ))}
                    </div>
                    <p className="text-sm  text-muted-foreground/80 line-clamp-2">
                      {tutor.bio || "No bio available."}
                    </p>
                    <Separator className='mt-4'/>
                    <div className="mt-4 flex items-center justify-between">
                      <Link  className='text-primary text-sm font-semibold' href={`/tutors/${tutor.id}`} key={tutor.id}>More details <IconArrowRight className='inline-flex size-3 items-center justify-center gap-2 ' /></Link>
                      <ButtonGroup>
                        <Button size="sm"  variant="outline" ><IconPhone/></Button>
                        <Button size="sm"  variant="outline" ><IconMessage2/></Button>
                        <Button size="sm"  variant="outline" ><IconShare/></Button>
                      </ButtonGroup>
                      
                      
                      </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Masonry>

        )}
      </div>
    </>
  );
}
