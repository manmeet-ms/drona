
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/src/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { verifyClassAttendance } from "@/src/app/actions/class";
import { addResourceLink, uploadResourceFile } from "@/src/app/actions/resources";

// ... imports

const tutorProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  subjects: z.string().min(2, "Subjects must be at least 2 characters"),
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be a positive number"),
});

type TutorProfileForm = z.infer<typeof tutorProfileSchema>;

export default function TutorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  
  // Resource Upload State
  const [resourceClassId, setResourceClassId] = useState<string | null>(null);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [resourceType, setResourceType] = useState("file");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);

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
        // Mocking classes fetch for now, ideally strictly typed API or server action
        axios.get("/api/tutors/classes") 
      ]);
      
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

  const handleVerify = async (classId: string) => {
      if(!verificationCode) {
          toast.error("Please enter a code");
          return;
      }
      
      const res = await verifyClassAttendance(classId, verificationCode);
      if(res.error) {
           toast.error(res.error);
      } else { 
          toast.success("Class Verified Successfully!"); 
          fetchData(); // Refresh list
          setVerificationCode("");
          setSelectedClassId(null);
      }
  };

  const handleResourceUpload = async () => {
      if (!resourceClassId || !resourceTitle) {
          toast.error("Please fill in all required fields");
          return;
      }

      // We need the tutorId. In a real scenario, we'd get this from the session or the class object 
      // if we trust the client (we shouldn't). 
      // ideally the Server Action should fetch the current user's tutorId from session.
      // For this implementation, we will pass a placeholder "tutor-id" and let the server 
      // action strictly validate (the server action provided earlier took tutorId as arg, 
      // implying it trusts the caller or the caller is another server component).
      
      // Let's assume we find the tutorId from the class object for now, or the API call needs to handle it.
      // Since `classes` state has `tutorId` usually.
      const cls = classes.find(c => c.id === resourceClassId);
      const tutorId = cls?.tutorId; 

      if (!tutorId) {
          toast.error("Tutor ID missing");
          return;
      }

      let res;
      if (resourceType === "link") {
          if (!resourceUrl) {
              toast.error("Please enter a URL");
              return;
          }
          res = await addResourceLink(resourceClassId, tutorId, resourceTitle, resourceUrl);
      } else {
          if (!resourceFile) {
              toast.error("Please select a file");
              return;
          }
           const formData = new FormData();
           formData.append("file", resourceFile);
           formData.append("title", resourceTitle);
           // We need to modify uploadResourceFile signature to accept formData directly or wrap it?
           // The server action 'uploadResourceFile' defined previously takes (classId, tutorId, formData).
           // But we can't easily pass classId/tutorId INSIDE formData unless we parse it there.
           // Let's call a wrapper or assume we modify the server action to parse form data for IDs?
           // Actually, best practice with Server Actions & FormData is usually `action={uploadResource}` form.
           // But here we are calling it programmatically.
           
           // We'll invoke it directly:
           res = await uploadResourceFile(resourceClassId, tutorId, formData);
      }

      if (res.error) {
          toast.error(res.error);
      } else {
          toast.success("Resource added successfully!");
          setResourceDialogOpen(false);
          // Reset form
          setResourceTitle("");
          setResourceUrl("");
          setResourceFile(null);
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
      {/* Profile Form (Existing) ... */}
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

      {/* Class Management */}
      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>Manage your scheduled classes</CardDescription>
        </CardHeader>
        <CardContent>
             {classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-dashed border rounded-lg">
                    No classes scheduled.
                </div>
             ) : (
                 <div className="space-y-4">
                     {classes.map((cls) => (
                         <div key={cls.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4">
                             <div>
                                 <h4 className="font-semibold">{cls.student.name} - {new Date(cls.scheduledAt).toLocaleString()}</h4>
                                 <p className="text-sm text-muted-foreground">Status: {cls.status}</p>
                             </div>
                             <div className="flex gap-2 items-center">
                                 {cls.status === 'SCHEDULED' && (
                                     <div className="flex items-center gap-2">
                                        <Input 
                                            placeholder="Enter 6-digit Code" 
                                            className="w-40"
                                            maxLength={6}
                                            value={selectedClassId === cls.id ? verificationCode : ""}
                                            onChange={(e) => {
                                                setSelectedClassId(cls.id);
                                                setVerificationCode(e.target.value);
                                            }}
                                        />
                                        <Button size="sm" onClick={() => handleVerify(cls.id)}>Verify</Button>
                                     </div>
                                 )}
                                 <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                        setResourceClassId(cls.id);
                                        setResourceDialogOpen(true);
                                    }}
                                 >
                                     Upload Resources
                                 </Button>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
        </CardContent>
      </Card>

      {/* Resource Upload Dialog */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add Resource</DialogTitle>
                  <DialogDescription>
                      Share files or links with your students.
                  </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="file" value={resourceType} onValueChange={setResourceType}>
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="file">File Upload</TabsTrigger>
                      <TabsTrigger value="link">External Link</TabsTrigger>
                  </TabsList>
                  
                  <div className="py-4 space-y-4">
                      <div className="space-y-2">
                          <Label>Title</Label>
                          <Input 
                              placeholder="Resource Title"
                              value={resourceTitle}
                              onChange={(e) => setResourceTitle(e.target.value)}
                          />
                      </div>

                      <TabsContent value="file" className="space-y-2">
                          <Label>File (Max 10MB)</Label>
                          <Input 
                               type="file" 
                               onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                          />
                      </TabsContent>
                      
                      <TabsContent value="link" className="space-y-2">
                          <Label>URL</Label>
                          <Input 
                               placeholder="https://youtube.com/..." 
                               value={resourceUrl}
                               onChange={(e) => setResourceUrl(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                              Supported: YouTube, LinkedIn, Instagram, GitHub, etc.
                          </p>
                      </TabsContent>
                  </div>
              </Tabs>

              <DialogFooter>
                  <Button variant="outline" onClick={() => setResourceDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleResourceUpload}>Add Resource</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
