'use client'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { Particles } from '../components/ui/particles'
import { useTheme } from '../contexts/ThemeContext'

export default function Home() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const theme = useTheme().theme
  const [color, setColor] = useState<string>('#ffffff')

  useEffect(() => {
    setColor(theme === 'light' ? '#000000' : '#ffffff')
  }, [theme])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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
      .fromTo(
        '.particles',
        {
          filter: 'blur(10px)',
          y: 80,
        },
        {
          filter: 'blur(0px)',
          y: 0,
          duration: 3,
        },
        '<0.5',
      )
  }, [])

  return (
    <main className="relative w-full h-[80vh] overflow-hidden bg-background">
      <Particles
        className="particles fixed inset-0 w-full h-full animate-in"
        quantity={200}
        ease={90}
        color={color}
        refresh
      />
      <section className="relative z-10 flex flex-col justify-center items-center w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-row items-center justify-center flex-wrap title tracking-widest perspective-[1000px] text-4xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl">
          {['H', 'Y', 'D', 'R', 'O', 'G', 'E', 'N'].map((letter, index) => (
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
          <p className="text-center text-foreground text-xs sm:text-sm md:text-base lg:text-lg">
            Hydrogen is the chemical element with the symbol H and atomic number
            1. With a standard atomic weight of 1.008, it's the lightest element
            in the periodic table and the most abundant substance in the
            universe, constituting roughly 75% of all baryonic mass.
          </p>
        </div>
      </section>
    </main>
  )
}
