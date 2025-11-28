import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import prisma from '@/src/lib/prisma';

export default async function TeacherDashboardPage() {
    const pingCount = await prisma.ping.count();
    const latest = await prisma.ping.findMany({ orderBy: { id: 'desc' }, take: 10 });

    return (
        <>
            {' '}
            <div style={{ padding: 24 }}>

          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
Drona</h1>
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
                <p>Ping count: {pingCount}</p>
                <h2>Latest pings</h2>
                <pre></pre>
            </div>
            <h1>Hello, Teacher Dashboard Home (Secure)</h1>
        </>
    );
}
