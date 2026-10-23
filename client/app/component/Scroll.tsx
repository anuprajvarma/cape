"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import coursepic from "../../public/course-page.png";

const sections = [
  {
    title: "Score",
    description: "Discover courses tailored to your goals.",
    color: "#172554",
  },
  {
    title: "List",
    description: "Build skills with interactive learning.",
    color: "#3730A3",
  },
  {
    title: "Discover",
    description: "See how far your learning takes you.",
    color: "#065F46",
  },
];

function StackCard({
  section,
  index,
}: {
  section: (typeof sections)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  return (
    <div
      ref={ref}
      className="sticky w-full"
      style={{
        top: `${100 + index * 18}px`,
        zIndex: index * 10,
        // marginBottom: "15vh",
      }}
    >
      <motion.section
        style={{
          scale,
          transformOrigin: "center",
        }}
        className="flex h-120 w-full items-center justify-center
      overflow-hidden rounded-[20px] border border-white/5
      bg-white/5 text-center text-white shadow-2xl
      backdrop-blur-2xl"
      >
        <div className="flex h-full w-full">
          <div className="flex w-1/2 items-center">
            <div className="w-full px-12 text-start">
              <p className="text-3xl font-semibold">{section.title}</p>
              <p>{section.description}</p>
            </div>
          </div>

          <div className="w-1/2 p-2">
            <Image
              src={coursepic}
              alt="Course preview"
              className="h-full w-full object-cover rounded-[20px]"
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default function ScrollStack() {
  return (
    <div className="relative flex flex-col gap-16">
      {sections.map((section, index) => (
        <StackCard key={section.title} section={section} index={index} />
      ))}
    </div>
    // </div>
  );
}
