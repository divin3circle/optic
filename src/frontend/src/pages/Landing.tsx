import React from "react";
import Hero from "../components/app/landing/Hero";
import Features from "../components/app/landing/Features";
import { useAuth } from "@nfid/identitykit/react";
import Loading from "../components/ui/Loading";
import { useNavigate } from "react-router-dom";

function Landing() {
  const { isConnecting, user } = useAuth();
  const navigate = useNavigate();

  if (isConnecting) {
    return <Loading />;
  }

  if (user) {
    navigate("/onboard");
  }
  return (
    <div className="h-screen w-screen bg-background max-w-screen-[1140px] mx-auto my-0">
      <Hero />
      <Features />
    </div>
  );
}

export default Landing;
