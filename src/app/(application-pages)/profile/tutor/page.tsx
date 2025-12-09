import TutorProfileForm from "@/src/components/profile/TutorProfileForm";
import { constructMetadata } from "@/src/lib/metadata";

export const metadata = constructMetadata({
  title: "Tutor Profile",
  description: "Manage your tutor profile."
});

export default function TutorProfilePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your tutor profile, subjects, and rates.</p>
      </div>
      <TutorProfileForm />
    </div>
  );
}
