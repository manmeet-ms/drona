"use client";
import { AppHeader } from "@/src/components/Headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useSession } from "next-auth/react";


export default   function DashboardPage() {
    
  const session =useSession();
console.log("getServerSession",session);

  if (session.status === "loading") return <p>Loading...</p>;
  if (session.status === "unauthenticated") return <p>Access Denied</p>;

    return (
        <>
            {' '}
<AppHeader/>
            <div style={{ padding: 24 }}>

          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
Welcome to Drona</h1>

<Card>
  <CardHeader>
    <CardTitle>Welcome {session?.data?.user?.name}</CardTitle>
    <CardDescription>Your as registered as  {session?.data?.user?.role.toLowerCase()}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

                <h2>Latest pings</h2>
                <pre></pre>
            </div>
            <h1>Hello, Teacher Dashboard Home (Secure)</h1>
        </>
    );
}
