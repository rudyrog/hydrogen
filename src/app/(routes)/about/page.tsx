"use client";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function About() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const contentRef = useRef(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

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
      );
  }, []);

  return (
    <div className="bg-background">
      <div className="flex gap-2 flex-col container mx-auto p-3 w-full sm:w-5/6 md:w-5/6 lg:w-5/6">
        <h1 className="title flex flex-row justify-center md:justify-start text-3xl md:text-7xl lg:text-8xl pt-10 sm:pt-15 md:pt-20">
          {["A", "B", "O", "U", "T"].map((letter, index) => (
            <p
              key={index}
              //@ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-1 sm:mx-2 md:mx-3 transition-colors duration-300 cursor-default select-none"
            >
              {letter}
            </p>
          ))}
        </h1>

        <div className="flex flex-col md:flex-row gap-3  w-full">
          <div
            ref={contentRef}
            className="w-full md:w-1/2 border border-border/50 p-3 sm:p-4 md:p-5 rounded-md hover:shadow-lg"
          >
            <h2 className="text-lg sm:text-xl font-serif">Chemistry</h2>
            <div className="w-full">
              <p className="text-sm sm:text-base">
                It is a branch of science that studies the properties and
                behavior of matter, including the composition, structure, and
                behavior of atoms, molecules, and ions.
              </p>
            </div>
            <h2 className="text-lg sm:text-xl font-serif mt-2">Development</h2>
            <div className="text-sm sm:text-base">
              This is a project created by{" "}
              <a
                href="https://github.com/rudyrog"
                target="_blank"
                rel="noopener noreferrer"
                className="name-link"
              >
                Rudra Mehta,
              </a>{" "}
              <a
                href="https://github.com/parv141206"
                target="_blank"
                rel="noopener noreferrer"
                className="name-link"
              >
                Parv Shah,
              </a>{" "}
              <a
                href="https://github.com/djman323"
                target="_blank"
                rel="noopener noreferrer"
                className="name-link"
              >
                Devansh Jani{" "}
              </a>
              and{" "}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="name-link"
              >
                Hrishit Patel
              </a>
              .
            </div>
            <p className="text-sm sm:text-base">
              Support our project on{" "}
              <a
                href="https://github.com/rudyrog/periodic-table"
                target="_blank"
                rel="noopener noreferrer"
                className="name-link"
              >
                GitHub
              </a>
              .
            </p>
            <div className="mt-2">
              <p className="font-serif text-base sm:text-lg">
                Technologies Used
              </p>
              <div className="space-y-4 mt-2">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="p-3 border rounded-lg hover:bg-gray-100 transition-all hover:shadow-md">
                    <a
                      href="https://nextjs.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="name-link"
                    >
                      <h3 className="font-bold">Next.js</h3>
                      <p className="text-sm text-gray-600">
                        React framework for production
                      </p>
                    </a>
                  </li>
                  <li className="p-3 border rounded-lg hover:bg-gray-100 transition-all hover:shadow-md">
                    <a
                      href="https://tailwindcss.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="name-link"
                    >
                      <h3 className="font-bold">TailwindCSS</h3>
                      <p className="text-sm text-gray-600">
                        Utility-first CSS framework
                      </p>
                    </a>
                  </li>
                  <li className="p-3 border rounded-lg hover:bg-gray-100 transition-all hover:shadow-md">
                    <a
                      href="https://www.typescriptlang.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="name-link"
                    >
                      <h3 className="font-bold">TypeScript</h3>
                      <p className="text-sm text-gray-600">
                        Type-safe JavaScript
                      </p>
                    </a>
                  </li>
                  <li className="p-3 border rounded-lg hover:bg-gray-100 transition-all hover:shadow-md">
                    <a
                      href="https://gsap.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="name-link"
                    >
                      <h3 className="font-bold">GSAP</h3>
                      <p className="text-sm text-gray-600">
                        Professional animation library
                      </p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-fit hidden md:flex md:flex-row justify-evenly md:justify-start gap-2 mt-4 md:mt-0 rounded-md hover:shadow-lg">
            <Image
              width={370}
              height={190}
              src="/images/mercury.jpg"
              alt="Mercury"
              className="w-full md:w-auto border border-border/30 mb-2 md:mb-0"
              //@ts-ignore
              ref={(el) => (imagesRef.current[0] = el as HTMLImageElement)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
