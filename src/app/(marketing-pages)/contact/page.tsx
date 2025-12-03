import React from 'react';
import { LandingHeader } from '@/src/components/Headers';

export default function ContactPage() {
  return (
    <>
      <LandingHeader />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the contact page.
        </p>
      </div>
    </>
  );
}
