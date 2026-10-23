"use client";

import React from "react";
import { motion } from "motion/react";

import { testimonials } from "../utils/reusableConstant";
import Image from "next/image";
import course from "../../public/courses.png";

export default function MotionMarquee() {
  return (
    <div className="flex w-full items-center overflow-hidden">
      <motion.div
        className="flex w-max shrink-0 gap-16"
        animate={{ x: ["0%", "-40%"] }}
        transition={{
          ease: "linear",
          duration: 15,
          repeat: Infinity,
        }}
      >
        {[...testimonials, ...testimonials].map((item, index) => (
          <div
            key={`first-${index}`}
            className="w-120 h-52 flex items-center justify-center  bg-white/5 backdrop-blur-2xl rounded-[20px] border border-white/5"
          >
            <div className="w-8/12 flex flex-col gap-2 justify-center items-center">
              <p className="text-sm line-clamp-3">{item.testimonial}</p>
              <div className="flex gap-4 items-center">
                <Image
                  src={course}
                  className="w-8 h-8 rounded-full"
                  alt="aldf"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-sm">Learner</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
