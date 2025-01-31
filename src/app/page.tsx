"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Particles } from "../components/ui/particles";
import { useTheme } from "../contexts/ThemeContext";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function SimpleCard({
  title,
  desc,
  className,
}: {
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div
      className={`body border ${className} border-border/50 p-3 w-fit sm:p-4 md:p-5 lg:p-6 shadow-lg shadow-foreground/5 bg-background/30 backdrop-blur-md rounded-lg mt-8 sm:mt-10 md:mt-12 lg:mt-16`}
    >
      <div className="text-3xl font-bold subtitle">{title}</div>
      {desc}
    </div>
  );
}

export default function Home() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const theme = useTheme().theme;
  const [color, setColor] = useState<string>("#ffffff");

  useEffect(() => {
    setColor(theme === "light" ? "#000000" : "#ffffff");
  }, [theme]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    letterRefs.current = letterRefs.current.slice(0, 8);

    const tl = gsap.timeline({
      defaults: {
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
            each: 0.08,
            from: "start",
          },
          duration: 0.8,
        },
        "<0.1",
      )
      .fromTo(
        ".description",
        {
          filter: "blur(10px)",
          y: 80,
        },
        {
          filter: "blur(0px)",
          y: 0,
          duration: 3,
        },
        "<0.1",
      )
      .fromTo(
        ".particles",
        {
          filter: "blur(10px)",
          y: 80,
        },
        {
          filter: "blur(0px)",
          y: 0,
          duration: 3,
        },
        "<0.5",
      ) .fromTo(
        ".card1",
        {
          filter: "blur(10px)",
          y: 80,
        },
        {
          filter: "blur(0px)",
          y: 0,
          duration: 3,
        },
        "<0.5",
      ) .fromTo(
        ".card2",
        {
          filter: "blur(10px)",
          y: 80,
        },
        {
          filter: "blur(0px)",
          y: 0,
          duration: 3,
        },
        "<0.5",
      ).fromTo(
        ".card3",
        {
          filter: "blur(10px)",
          y: 80,
        },
        {
          filter: "blur(0px)",
          y: 0,
          duration: 3,
        },
        "<0.5",
      ).fromTo(
        ".card4",
        {
          filter: "blur(10px)",
          y: 80,
        },
        {
          filter: "blur(0px)",
          y: 0,
          duration: 3,
        },
        "<0.5",
      );
  }, []);

  return (
    <main className="relative w-full h-[80vh] bg-background">
      <Particles
        className="particles fixed inset-0 w-full h-full animate-in"
        quantity={200}
        ease={90}
        color={color}
        refresh
      />
      <section className="relative z-10 flex flex-col justify-center items-center w-full min-h-[180vh] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-row items-center justify-center flex-wrap title tracking-widest perspective-[1000px] text-4xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl">
          {["H", "Y", "D", "R", "O", "G", "E", "N"].map((letter, index) => (
            <p
              key={index}
              // @ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-1 sm:mx-2 md:mx-3 lg:mx-4 transition-colors duration-300 cursor-default select-none text-foreground"
            >
              {letter}
            </p>
          ))}
        </div>
        <div className="description max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[65%] border border-border/50 p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg shadow-foreground/5 bg-background/30 backdrop-blur-md rounded-lg mt-8 sm:mt-10 md:mt-12 lg:mt-16">
          <p className="text-center text-foreground text-xl sm:text-sm md:text-base lg:text-lg">
            Want to learn Chemistry the easy way? <br />Learn, Quiz and perfect your grasp on Chemistry without having to read textbooks for an eternity!  
          </p>
        </div>
        <div className="relative md:w-4/5 flex flex-col items-center justify-center gap-3 mx-auto my-10 md:my-0  min-h-screen">
          <InteractiveHoverButton className="text-xl">Start Learning</InteractiveHoverButton>
          <SimpleCard
            className="w-full md:w-1/3  md:absolute  top-10 left-0 card1"
            title="Games"
            desc="Play exciting games and master every element without even realizing you're learning!"
          />
          <SimpleCard
            className="w-full md:w-1/3 md:absolute top-20 right-0 card2"
            title="Customizations"
            desc="Tweak the games your way—because learning should be as fun as you want it to be!"
          />
          <SimpleCard
            className="w-full md:w-1/3 md:absolute bottom-20 left-28 card3"
            title="Progress"
            desc="Keep track of your journey and see where you shine (or where you need a little extra spark)!"
          />
          <SimpleCard
            className="w-full md:w-1/3 md:absolute bottom-32 right-20 card4"
            title="Pricing"
            desc="100% free—because learning should never come with a price tag!"
          />
        </div>
      </section>
    </main>
  );
}
