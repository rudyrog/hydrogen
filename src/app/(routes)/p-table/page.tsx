"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import PeriodicTable from "../../../components/PeriodicTable";
import { useTheme } from "../../../contexts/ThemeContext";
export default function PTable() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const theme = useTheme().theme;
  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 14);

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      defaults: {
        duration: 1.2,
        ease: "elastic.out(1, 0.8)",
      },
    });

    tl.fromTo(
      letterRefs.current,
      {
        y: 120,
        opacity: 0,
        rotateX: -80,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        stagger: {
          each: 0.1,
          ease: "power2.inOut",
        },
      },
    )
      .fromTo(
        letterRefs.current,
        {
          filter: "blur(10px)",
        },
        {
          filter: "blur(0px)",
          stagger: {
            each: 0.14,
            from: "start",
          },
          duration: 0.8,
        },
        "<0.1",
      )
      .fromTo(
        ".p-table",
        {
          filter: "blur(10px)",
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5",
      );
  }, []);
  return (
    <div className="flex flex-col gap-12 py-8 bg-background">
      <div className="flex flex-col gap-3 container mx-auto  w-5/6">
        <h1 className="quiz-title grid grid-cols-8 md:flex md:flex-row text-3xl md:text-7xl text-center md:text-start title pt-20 gap-2">
          {[
            "P",
            "E",
            "R",
            "I",
            "O",
            "D",
            "I",
            "C",
            "",
            "T",
            "A",
            "B",
            "L",
            "E",
          ].map((letter, index) => (
            <p
              key={index}
              //  @ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className={`mx-3 transition-colors duration-300 cursor-default select-none ${
                letter === "" ? "invisible" : ""
              }`}
            >
              {letter}
            </p>
          ))}
        </h1>
      </div>
      <div className="relative p-10 md:p-10 md:overflow-hidden overflow-x-scroll md:flex items-center justify-center">
        <PeriodicTable />
      </div>
    </div>
  );
}
