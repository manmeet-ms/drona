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

import { usePageTitle } from "@/src/hooks/usePageTitle";

export default function TutorsPage() {
  usePageTitle("Find Tutors");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");

  const [classesTaught, setClassesTaught] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (subject) params.append("subject", subject);
      if (location) params.append("location", location);
      if (classesTaught) params.append("classesTaught", classesTaught);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (rating) params.append("rating", rating);

      const response = await axios.get(`/api/tutors?${params.toString()}`);
      setTutors(response.data);
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Find a Tutor</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Location is also here as per requirement */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input 
                            placeholder="City..." 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Class Range</label>
                        <Input 
                            placeholder="e.g. 1-5" 
                            value={classesTaught} 
                            onChange={(e) => setClassesTaught(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hourly Rate (₹)</label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Min" 
                                type="number" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                            />
                            <Input 
                                placeholder="Max" 
                                type="number" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Min Rating</label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="4.5">4.5+</option>
                            <option value="4">4.0+</option>
                            <option value="3">3.0+</option>
                        </select>
                    </div>

                    <Button className="w-full" onClick={fetchTutors}>
                        Apply Filters
                    </Button>
                </CardContent>
            </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
                <Input
                placeholder="Search by Subject (e.g. Math)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
            <p className="text-center text-muted-foreground">No tutors found matching your criteria.</p>
            ) : (
            <Masonry spacing={1.5} columns={{ xs: 1, sm: 2, md: 3 }}>
                {tutors.map((tutor) => (
                <Link href={`/tutors/${tutor.id}`} key={tutor.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <CardTitle className='flex justify-between items-center' >{tutor.user.fullname}
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
                            <Badge variant="secondary" key={subj}>{subj}</Badge>
                        ))}
                        </div>
                        <p className="text-sm  text-muted-foreground/80 line-clamp-2">
                        {tutor.bio || "No bio available."}
                        </p>
                        <Separator className='mt-4' />
                        <div className="mt-4 flex items-center justify-between">
                        <Link className='text-primary text-sm font-semibold' href={`/tutors/${tutor.id}`} key={tutor.id}>More details <IconArrowRight className='inline-flex size-3 items-center justify-center gap-2 ' /></Link>
                        </div>
                    </CardContent>
                    </Card>
                </Link>
                ))}
            </Masonry>
            )}
        </div>
      </div>
    </div>
  );
}
