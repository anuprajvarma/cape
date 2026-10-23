"use client";

import React from "react";
import HeroSection from "./component/HeroSection";
import ScoreSection from "./component/ScoreSection";
import Testomonials from "./component/Testomonials";
import NavBar from "./component/NavBar";

export default function Page() {
  return (
    <>
      <HeroSection />
      <ScoreSection />
      <Testomonials />
      <NavBar />
    </>
  );
}
