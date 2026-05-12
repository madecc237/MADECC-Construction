import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PolicyPage({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold tracking-tighter uppercase mb-12">{title}</h1>
        <div className="prose prose-zinc max-w-none text-gray-600 leading-relaxed space-y-6">
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
}
