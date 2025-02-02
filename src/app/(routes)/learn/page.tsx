"use client";
import Achro from "@/components/Achro";
import PeriodicTable from "@/components/PeriodicTable";
import Trends from "@/components/learn/Trends";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Learn() {
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const groups = [
    {
      name: "Group 1: Alkali Metals",
      description: "Highly reactive metals that react vigorously with water.",
      examples: "Examples: Lithium, Sodium",
      highlighted: [3, 11, 19, 37, 55, 87],
      details:
        "⚡Did you know? Alkali metals are so reactive, they can even explode when they touch water! They're like the superheroes of the periodic table, always ready to react and show off their powers!",
    },
    {
      name: "Group 2: Alkaline Earth Metals",
      description: "Reactive metals, but less so than alkali metals.",
      examples: "Examples: Calcium, Magnesium",
      highlighted: [4, 12, 20, 38, 56, 88],
      details:
        "💪Fun fact: These metals are strong and tough, but not as explosive as Alkali metals. They’re still pretty cool, though – ever heard of magnesium flares that light up the night sky?",
    },
    {
      name: "Groups 3–12: Transition Metals",
      description: "Malleable, ductile, and good conductors of electricity.",
      examples: "Examples: Iron, Copper",
      highlighted: [26, 27, 28, 29, 30, 31, 32],
      details:
        "🔧Spotlight moment: These metals are like the all-arounders of the periodic table. Iron builds bridges, Copper conducts electricity, and Gold? It’s the bling of the table!",
    },
    {
      name: "Group 13: Boron Group",
      description: "Contains metals and a metalloid.",
      examples: "Examples: Boron, Aluminum",
      highlighted: [5, 13, 31, 49, 81, 113],
      details:
        "🤖Cool fact: This group is a mix of metals and metalloids, making them versatile! Aluminum is the lightweight hero in your soda cans, while Boron is used in everything from glass to semiconductors!",
    },
    {
      name: "Group 14: Carbon Group",
      description: "Contains nonmetals, metalloids, and metals.",
      examples: "Examples: Carbon, Silicon",
      highlighted: [6, 14, 32, 50, 82],
      details:
        "🧠Mind-blowing: Carbon is the building block of life itself! From diamonds to graphite, it’s the versatile element that makes your pencils write and makes up all living things.",
    },
    {
      name: "Group 15: Nitrogen Group (Pnictogens)",
      description: "Includes nonmetals, metalloids, and a metal.",
      examples: "Examples: Nitrogen, Phosphorus",
      highlighted: [7, 15, 33, 51, 83],
      details:
        "💨Did you know? Nitrogen is the most abundant gas in our atmosphere, but it’s super chill and doesn’t like to react easily. Phosphorus, however, is super reactive and even glows in the dark!",
    },
    {
      name: "Group 16: Oxygen Group (Chalcogens)",
      description: "Reactive elements, including oxygen and sulfur.",
      examples: "Examples: Oxygen, Sulfur",
      highlighted: [8, 16, 34, 52, 84],
      details:
        "🌋Hot stuff: Oxygen helps us breathe and is the most abundant element in the Earth’s crust. Sulfur smells like rotten eggs – trust us, you’ll never forget it!",
    },
    {
      name: "Group 17: Halogens",
      description: "Very reactive nonmetals. React with metals to form salts.",
      examples: "Examples: Fluorine, Chlorine",
      highlighted: [9, 17, 35, 53, 85],
      details:
        "💥Explosive facts: These elements are super reactive! Chlorine helps sanitize pools, but be careful – Fluorine is so reactive, it’s one of the most dangerous elements!",
    },
    {
      name: "Group 18: Noble Gases",
      description: "Inert gases with very low reactivity.",
      examples: "Examples: Helium, Neon",
      highlighted: [2, 10, 18, 36, 54],
      details:
        "🎈Fun fact: Noble gases are the cool, quiet types. Helium fills up your party balloons, and Neon gives signs their bright, glowing colors – they’re just chill, doing their own thing!",
    },
  ];
  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 7);

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
        ".learn",
        {
          filter: "blur(10px)",
          y: 10,
          opacity: 0,
          rotateX: -80,
          //scale: 0.8,
        },
        {
          filter: "blur(0px)",
          y: 0,
          opacity: 1,
          rotateX: 0,
          //scale: 1,
          ease: "power2.inOut",
        },
      )
      .fromTo(
        ".p-table",
        {
          filter: "blur(10px)",
          //y: 10,
          opacity: 0,
          //rotateX: -80,
          //scale: 0.8,
        },
        {
          filter: "blur(0px)",
          //y: 0,
          opacity: 1,
          //rotateX: 0,
          //scale: 1,
          ease: "power2.inOut",
        },
      );
  }, []);

  return (
    <div className="container mx-auto py-24">
      <h1 className="quiz-title md:justify-start justify-center flex flex-row text-3xl md:text-6xl lg:text-8xl md:text-start text-center title px-2 sm:px-3 md:px-4">
        {["L", "E", "A", "R", "N"].map((letter, index) => (
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
      <div className="flex flex-col gap-2 p-5 text-xl">
        <div className="learn flex flex-col gap-3 mb-2">
          <b className="text-4xl font-normal font-[Monty] tracking-tight w-fit">
            Groups
          </b>
          <div>
            <p>
              Before the tips you should be familiar with the groups and trends.
            </p>
            <p>
              There's 18 Groups. Each group represents a set of elements with
              the same properties.
            </p>
          </div>
        </div>
        <div className="p-table flex flex-col gap-2">
          <div className="">
            <Select
              defaultValue={String(0)}
              onValueChange={(value) => setSelectedGroup(Number(value))}
            >
              <SelectTrigger className="w-fit gap-4 text-xl body text-foreground shadow-md rounded-lg bg-background border border-border/60 outline-none">
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border/30 shadow-md backdrop-blur-sm text-lg">
                {groups.map((group, index) => (
                  <SelectItem
                    key={index}
                    value={String(index)}
                    className="hover:bg-foreground/10 transition-colors duration-300 text-lg"
                  >
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-xl mx-2">
            {selectedGroup !== null && (
              <div>
                <p>{groups[selectedGroup].description}</p>
                <p className="text-foreground/50 font-medium ">
                  {groups[selectedGroup].examples}
                </p>
              </div>
            )}
            <div className=" overflow-x-scroll">
              <PeriodicTable
                normal={false}
                half={true}
                highlighted={
                  selectedGroup !== null
                    ? groups[selectedGroup].highlighted
                    : []
                }
              />
            </div>
          </div>

          <p className="text-pretty">{groups[selectedGroup].details}</p>
          <b className="text-4xl font-normal font-[Monty] tracking-tight w-fit mt-10">
            Trends
          </b>
          <Trends />
          <b className="text-4xl font-normal font-[Monty] tracking-tight w-fit mt-10">
            Memorize
          </b>
          <div className="container w-[80%]">
            <div className="text-xl">
              Following are few mnemonics in Hindi/English to remember specific
              columns of the periodic table
            </div>
            <Achro />
          </div>
          <div className="text-xl">
            We encourage you take quizes! Practice makes one perfect!
          </div>
          <Link href={"/quiz"}>
            <InteractiveHoverButton className="font-[monty]">
              Explore Quizes
            </InteractiveHoverButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
