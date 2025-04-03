"use client";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function About() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const contentRef = useRef(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const teamMembersRef = useRef(null);

  const teamMembers = [
    { name: "Jyot Patel", github: "https://github.com/jyot1901" },
    { name: "Dhruv Patel", github: "https://github.com/Dhruv6806" },
    { name: "Kaamil Gohel", github: "https://github.com/kaamil1210" },
    { name: "Jash Patel", github: "https://github.com/jash1924" },
  ];

  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 5);
    imagesRef.current = imagesRef.current.slice(0, 2);

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
            each: 0.08,
            from: "start",
          },
          duration: 0.8,
        },
        "<0.1",
      )
      .fromTo(
        contentRef.current,
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
      )
      .fromTo(
        imagesRef.current,
        {
          filter: "blur(10px)",
          opacity: 0,
          x: 100,
          rotateY: 15,
          scale: 0.9,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.8",
      )
      .fromTo(
        teamMembersRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
      );
  }, []);

  return (
    <div className="--bg-background min-h-screen">
      <div className="flex gap-2 flex-col container mx-auto p-3 w-full sm:w-5/6 md:w-5/6 lg:w-5/6">
        <h1 className="title flex flex-row justify-center md:justify-start text-5xl md:text-7xl lg:text-8xl pt-10 sm:pt-15 md:pt-20">
          {["A", "B", "O", "U", "T"].map((letter, index) => (
            <p
              key={index}
              //@ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-1 sm:mx-2 md:mx-3 transition-colors duration-300 cursor-default select-none text-foreground"
            >
              {letter}
            </p>
          ))}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div
            ref={contentRef}
            className="w-full md:w-1/2 rounded-2xl p-6 sm:p-4 md:p-5 transition-all duration-300 bg-background border border-border/30 hover:shadow-lg"
          >
            <h2 className="text-lg sm:text-xl font-[monty] text-foreground border-b border-border/50 mb-4 w-fit">
              Team Members
            </h2>

            <div ref={teamMembersRef}>
              <div>
                {teamMembers.map((member, index) => (
                  <div key={index} className="group relative">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                        <div className="flex flex-row gap-2 items-center">
                          <p>~</p>
                          <p className="text-base sm:text-lg text-foreground line-clamp-1">
                            {member.name}
                          </p>
                          <p className="text-xs sm:text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            /github
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <h2 className="text-lg sm:text-xl font-[monty] text-foreground border-b border-border/50 w-fit">
                Tech Stack
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="p-3 bg-background rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[7.2px] hover:bg-background transition-all group dark:border dark:border-border/30">
                  <a
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="name-link"
                  >
                    <h3 className="text-foreground text-lg">Next.js</h3>
                    <p className="text-sm text-foreground group-hover:text-foreground transition-colors">
                      React framework for production
                    </p>
                  </a>
                </li>
                <li className="p-3 bg-background rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[7.2px] hover:bg-background transition-all group dark:border dark:border-border/30">
                  <a
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="name-link"
                  >
                    <h3 className="text-foreground text-lg">Tailwind Css</h3>
                    <p className="text-sm text-foreground group-hover:text-foreground transition-colors">
                      Utility-first CSS framework
                    </p>
                  </a>
                </li>
                <li className="p-3 bg-background rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[7.2px] hover:bg-background transition-all group dark:border dark:border-border/30">
                  <a
                    href="https://www.typescriptlang.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="name-link"
                  >
                    <h3 className="text-foreground text-lg">Typescript</h3>
                    <p className="text-sm text-foreground group-hover:text-foreground transition-colors">
                      Type-safe JavaScript
                    </p>
                  </a>
                </li>
                <li className="p-3 bg-background rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[7.2px] hover:bg-background transition-all group dark:border dark:border-border/30">
                  <a
                    href="https://gsap.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="name-link"
                  >
                    <h3 className="text-foreground text-lg">Gsap</h3>
                    <p className="text-sm text-foreground group-hover:text-foreground transition-colors">
                      Professional animation library
                    </p>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-fit hidden md:flex md:flex-row justify-evenly md:justify-start gap-2 mt-4 md:mt-0 rounded-md">
            <Image
              width={370}
              height={190}
              src="/images/mercury.jpg"
              alt="Mercury"
              className="w-full md:w-auto border border-border/30 mb-2 md:mb-0 rounded-lg hover:shadow-lg"
              //@ts-ignore
              ref={(el) => (imagesRef.current[0] = el as HTMLImageElement)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
