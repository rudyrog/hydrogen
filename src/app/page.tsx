'use client'
import Particles from '@/components/ui/particles'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function Home() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 8)

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
            each: 0.08,
            from: 'start',
          },
          duration: 0.8,
        },
        '<0.1',
      )
      .fromTo(
        '.description',
        {
          filter: 'blur(10px)',
          y: 80,
        },
        {
          filter: 'blur(0px)',
          y: 0,
          duration: 3,
        },
        '<0.1',
      )
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <Particles
        className="absolute inset-0 w-full h-full"
        quantity={300}
        ease={80}
        color="black"
        refresh
      />
      <div className="relative z-10 flex flex-col justify-center  items-center h-full">
        <div className="flex flex-row items-center justify-center title tracking-widest perspective-[1000px] text-[1vw] md:text-[10rem] ">
          {['H', 'Y', 'D', 'R', 'O', 'G', 'E', 'N'].map((letter, index) => (
            <p
              key={index}
              //  @ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-3 transition-colors duration-300 cursor-default select-none"
            >
              {letter}
            </p>
          ))}
        </div>
        <div className="description max-w-[80%] md:max-w-[65%] border border-black/15 p-4 md:p-6 shadow-lg shadow-black/10 bg-white/90 backdrop-blur-md rounded-lg mt-8">
          <p className="text-center">
            <span className="font font-mono">Hydrogen</span> is the chemical
            element with the symbol H and atomic number 1. With a standard
            atomic weight of 1.008, It's the lightest element in the periodic
            table. Hydrogen is the most abundant chemical substance in the
            universe, constituting roughly 75% of all baryonic mass.
          </p>
        </div>
      </div>
    </div>
  )
}
