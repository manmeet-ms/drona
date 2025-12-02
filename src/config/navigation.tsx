import { IconHome, IconSearch, IconChartBar, IconMessage, IconCalendar, IconUser, IconBook } from "@tabler/icons-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
}

export const parentNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: IconHome },
  { title: "Find Tutors", href: "/tutors", icon: IconSearch },
  { title: "Progress", href: "/dashboard/progress", icon: IconChartBar },
  { title: "Messages", href: "/dashboard/messages", icon: IconMessage },
  { title: "Schedule", href: "/dashboard/schedule", icon: IconCalendar },
  { title: "Payments", href: "/parent/payments", icon: IconChartBar }, // TODO: Add Payment Icon
  { title: "Queries", href: "/parent/query", icon: IconMessage },
  { title: "Profile", href: "/profile/parent", icon: IconUser },
];

export const tutorNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: IconHome },
  { title: "My Profile", href: "/profile/tutor", icon: IconUser },
  { title: "Progress", href: "/dashboard/progress", icon: IconChartBar },
  { title: "Messages", href: "/dashboard/messages", icon: IconMessage },
  { title: "Schedule", href: "/dashboard/schedule", icon: IconCalendar },
];

export const studentNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: IconHome },
  { title: "Find Tutors", href: "/tutors", icon: IconSearch },
  { title: "Homework", href: "/student/homework", icon: IconBook }, // Need to import IconBook
  { title: "Attendance", href: "/student/attendance", icon: IconCalendar },
  { title: "Queries", href: "/student/query", icon: IconMessage },
  { title: "Messages", href: "/dashboard/messages", icon: IconMessage },
  { title: "Schedule", href: "/dashboard/schedule", icon: IconCalendar },
  { title: "Profile", href: "/profile/student", icon: IconUser },
];
