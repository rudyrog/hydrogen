'use client'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import PeriodicTable from '../../../components/PeriodicTable'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
export default function PTable() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 14)

    gsap.registerPlugin(ScrollTrigger)

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
    )
      .fromTo(
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
      .fromTo(
        '.p-table',
        {
          filter: 'blur(10px)',
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5',
      )
    const dmitriTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#dmitri-section',
        start: 'top center',
        end: 'top 20%',
        scrub: 1,
      },
    })

    dmitriTimeline.fromTo(
      '.dmitri-card',
      {
        filter: 'blur(10px)',
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
      },
    )
    const legendTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#legend-section',
        start: 'top center',
        end: 'top 20%',
        scrub: 1,
      },
    })

    legendTimeline.fromTo(
      '.legend-card',
      {
        filter: 'blur(10px)',
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
      },
    )
  }, [])
  return (
    <div className="flex flex-col gap-12 py-8">
      <div className="flex flex-col gap-3 container mx-auto  w-5/6">
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
      </div>
      <div className="relative w-screen flex items-end justify-center">
        <div className="p-table">
          <PeriodicTable />
        </div>
      </div>
      <section id="dmitri-section">
        <div className="container mx-auto w-5/6">
          <Card className="dmitri-card p-6 space-y-4 h-fit flex w-2/3 border-none bg-transparent">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-800">
                  🎩 Meet Dmitri Mendeleev, the Chemistry Wizard! 🧪
                </h2>

                <p className="text-slate-700">
                  In 1869, Dmitri had a big idea: organize all the universe's
                  building blocks, called <strong>elements</strong>, into a
                  magical chart—the <strong>Periodic Table</strong>! 🌍✨
                </p>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    📜 What's the Periodic Table?
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-slate-700">
                    <li>It's like a superhero lineup where:</li>
                    <li>
                      Each box is an element (like gold, oxygen, or sodium 🧂).
                    </li>
                    <li>
                      They're arranged by their powers, like weight and
                      behavior.
                    </li>
                    <li>
                      It's the recipe for making <em>everything</em>—from water
                      💧 to fireworks 🎆!
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    🧙‍♂️ Why Is Dmitri Cool?
                  </h3>
                  <p className="text-slate-700">
                    He guessed new elements{' '}
                    <strong>before they were discovered</strong>! 🔮
                    <br />
                    Next time you see the periodic table, thank Dmitri the
                    Wizard! 🪄✨
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="legend-section">
        <div className="container mx-auto w-5/6 mb-28">
          <Card className="max-w-2xl border-none legend-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                🧙‍♂️ Periodic Table Legend 🌈
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600">
                Each group of elements has its own special color. Here's what
                they mean:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-red-300 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">Alkali Metals:</strong>
                    <span className="text-slate-600 ml-2">
                      Super reactive metals! ⚡
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-red-400 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">
                      Alkaline Earth Metals:
                    </strong>
                    <span className="text-slate-600 ml-2">
                      Reactive, but not as much as alkali metals! 🪨
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-orange-300 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">
                      Transition Metals:
                    </strong>
                    <span className="text-slate-600 ml-2">
                      Tough, shiny, and versatile! 🛠️
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-green-300 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">Halogens:</strong>
                    <span className="text-slate-600 ml-2">
                      Super smelly and reactive gases! 🌬️
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-blue-300 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">Noble Gases:</strong>
                    <span className="text-slate-600 ml-2">
                      Calm and unreactive gases! 🎈
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-yellow-300 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">Lanthanides:</strong>
                    <span className="text-slate-600 ml-2">
                      Rare and shiny metals! ✨
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-purple-300 rounded shrink-0"></span>
                  <span>
                    <strong className="text-slate-900">Actinides:</strong>
                    <span className="text-slate-600 ml-2">
                      Radioactive and powerful! ☢️
                    </span>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
