'use client'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import PeriodicTable from '../../../components/PeriodicTable'
export default function PTable() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 14)

    const tl = gsap.timeline({
      defaults: {
        duration: 1.2,
        ease: 'elastic.out(1, 0.8)',
      },
    })

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
          ease: 'power2.inOut',
        },
      },
    ).fromTo(
      letterRefs.current,
      {
        filter: 'blur(10px)',
      },
      {
        filter: 'blur(0px)',
        stagger: {
          each: 0.14,
          from: 'start',
        },
        duration: 0.8,
      },
      '<0.1',
    )
  }, [])
  return (
    <div className="flex flex-col gap-12 py-8">
      <div className="flex  flex-col gap-3 container mx-auto  w-5/6">
        <h1 className="quiz-title flex flex-row text-7xl md:text-start text-center title pt-20">
          {[
            'P',
            'E',
            'R',
            'I',
            'O',
            'D',
            'I',
            'C',
            '',
            'T',
            'A',
            'B',
            'L',
            'E',
          ].map((letter, index) => (
            <p
              key={index}
              //  @ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-3 transition-colors duration-300 cursor-default select-none"
            >
              {letter}
            </p>
          ))}
        </h1>
        <br />
        <h2>🎩 Meet Dmitri Mendeleev, the Chemistry Wizard! 🧪</h2>
        <p>
          In 1869, Dmitri had a big idea: organize all the universe's building
          blocks, called <strong>elements</strong>, into a magical chart—the{' '}
          <strong>Periodic Table</strong>! 🌍✨
        </p>
        <h3>📜 What’s the Periodic Table?</h3>
        <ul className="list-disc list-inside">
          <li>It’s like a superhero lineup where:</li>
          <li>Each box is an element (like gold, oxygen, or sodium 🧂).</li>
          <li>They’re arranged by their powers, like weight and behavior.</li>
          <li>
            It’s the recipe for making <em>everything</em>—from water 💧 to
            fireworks 🎆!
          </li>
        </ul>
        <h3>🧙‍♂️ Why Is Dmitri Cool?</h3>
        <p>
          He guessed new elements <strong>before they were discovered</strong>
          ! 🔮
          <br />
          Next time you see the periodic table, thank Dmitri the Wizard! 🪄✨
        </p>
      </div>
      <div className="relative w-screen  flex items-end justify-center ">
        <div className=" ">
          <PeriodicTable />
        </div>
      </div>
      <div className="container mx-auto  w-5/6">
        <h2 className="text-2xl font-bold mb-4">🧙‍♂️ Periodic Table Legend 🌈</h2>
        <p className="mb-4">
          Each group of elements has its own special color. Here’s what they
          mean:
        </p>
        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="w-5 h-5 bg-red-300 rounded mr-3"></span>
            <strong>Alkali Metals:</strong> Super reactive metals! ⚡
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 bg-red-400 rounded mr-3"></span>
            <strong>Alkaline Earth Metals:</strong> Reactive, but not as much as
            alkali metals! 🪨
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 bg-orange-300 rounded mr-3"></span>
            <strong>Transition Metals:</strong> Tough, shiny, and versatile! 🛠️
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 bg-green-300 rounded mr-3"></span>
            <strong>Halogens:</strong> Super smelly and reactive gases! 🌬️
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 bg-blue-300 rounded mr-3"></span>
            <strong>Noble Gases:</strong> Calm and unreactive gases! 🎈
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 bg-yellow-300 rounded mr-3"></span>
            <strong>Lanthanides:</strong> Rare and shiny metals! ✨
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 bg-purple-300 rounded mr-3"></span>
            <strong>Actinides:</strong> Radioactive and powerful! ☢️
          </li>
        </ul>
      </div>
    </div>
  )
}
