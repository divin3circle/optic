import React from "react";
import Hero from "../components/app/landing/Hero";
import Features from "../components/app/landing/Features";

function Landing() {
  return (
    <div className="h-screen w-screen bg-background max-w-screen-[1140px] mx-auto my-0">
      <Hero />
      <Features />
    </div>
  );
}

export default Landing;
