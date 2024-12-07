"use client";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button"; // Shadcn button component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LucideArrowRight,
  MessageSquareTextIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react";

import animationData from "@/public/robot.json";
import dynamic from "next/dynamic";

const Player = dynamic(() => import('lottie-react'), { ssr: false });
export default function Home() {
  return (
    <main className="w-full min-h-screen">
      {/* Navigation Bar */}
      <Navigation isHero />

      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="-z-10">
          <Player
            animationData={animationData}
            className="w-80 h-80"
            loop
            autoplay
          />
        </div>
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">
          Empower Your Mental Health with SOMU
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Find comfort in genuine conversations and personalized support,
          anytime you need.
        </p>
        <div className="mt-6 flex gap-4">
          <Button size="lg">
            Get Started <LucideArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Problem Statements */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Do You Feel?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Struggling to manage stress and need someone to talk to?",
            "Looking for a safe, non-judgmental space to express yourself?",
            "Feeling disconnected and not sure where to turn for help?",
            "Worried that sharing your thoughts might feel overwhelming?",
          ].map((statement, index) => (
            <Card key={index}>
              <CardHeader className="flex justify-center items-center min-h-[300px] min-w-[300px] text-center">
                <CardTitle>{statement}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-center">What SOMU Offers</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Dual Support System",
              description:
                "Choose between talking to empathetic volunteers or a supportive AI companion. Get personalized support the way you want it.",
              icon: <UserIcon size={40} className="text-blue-500" />,
            },
            {
              title: "AI-Driven Support",
              description:
                "Our AI companion offers personalized advice and mindfulness exercises based on your unique needs.",
              icon: (
                <MessageSquareTextIcon size={40} className="text-blue-500" />
              ),
            },
            {
              title: "Anonymous Audio Meetings",
              description:
                "Connect with others safely and anonymously. Share your thoughts without the pressure of being judged.",
              icon: <SmileIcon size={40} className="text-blue-500" />,
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardContent>
                <div className="flex items-center gap-4 min-h-[200px] min-w-[200px]">
                  {feature.icon}
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <p>
            &copy; {new Date().getFullYear()} Aeternity. All Rights Reserved.
          </p>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Contact Us
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
