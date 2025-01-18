'use client'
import Particles from '@/components/ui/particles'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function Home() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const alfRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    letterRefs.current = letterRefs.current.slice(0, 8)
    alfRefs.current = alfRefs.current.slice(0, 13)

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

    const nobelTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#nobel-section',
        start: 'top center',
        end: 'top 20%',
        scrub: 1,
      },
    })

    nobelTimeline
      .fromTo(
        alfRefs.current,
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
          ease: 'elastic.out(1, 0.8)',
          stagger: {
            each: 0.1,
            ease: 'power2.inOut',
          },
        },
      )
      .fromTo(
        '.nobel-img',
        {
          x: -100,
          opacity: 0,
          scale: 0.8,
          rotate: -15,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 3,
          ease: 'power2.out',
        },
        '<0.2',
      )
      .fromTo(
        '.nobel-text',
        {
          x: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
        },
        '<0.3',
      )

    nobelTimeline.fromTo(
      [alfRefs.current, '.nobel-img', '.nobel-text'],
      {
        filter: 'blur(10px)',
      },
      {
        filter: 'blur(0px)',
        stagger: {
          each: 0.08,
          from: 'start',
        },
      },
      '<0.1',
    )
  }, [])

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <Particles
        className="fixed inset-0 w-full h-full"
        quantity={300}
        ease={80}
        color="black"
        refresh
      />
      <section className="relative z-10 flex flex-col justify-center items-center w-full min-h-screen pb-12">
        <div className="flex flex-row items-center justify-center title tracking-widest perspective-[1000px] text-6xl md:text-[10rem]">
          {['H', 'Y', 'D', 'R', 'O', 'G', 'E', 'N'].map((letter, index) => (
            <p
              key={index}
              // @ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-3 transition-colors duration-300 cursor-default select-none"
            >
              {letter}
            </p>
          ))}
        </div>
        <div className="description max-w-[80%] md:max-w-[65%] border border-black/15 p-4 md:p-6 shadow-lg shadow-black/10 bg-white/90 backdrop-blur-md rounded-lg mt-8">
          <p className="text-center">
            <span className="font font-serif">Hydrogen</span> is the chemical
            element with the symbol H and atomic number 1. With a standard
            atomic weight of 1.008, It's the lightest element in the periodic
            table. Hydrogen is the most abundant chemical substance in the
            universe, constituting roughly 75% of all baryonic mass.
          </p>
        </div>
        <div className="p-2 md:p-3 backdrop-blur-md rounded-lg text-black/60 mt-6">
          Scroll For More
        </div>
      </section>
      <section
        id="nobel-section"
        className="px-8  md:px-20 bg-white/90 text-black w-full flex flex-row items-center justify-center min-h-screen -mt-60"
      >
        <div className="flex flex-row h-fit w-full pt-12 justify-between">
          <Image
            width={400}
            height={400}
            src="/images/nobel.jpg"
            alt="Nobel"
            className="nobel-img border border-black-20 z-30"
          />
          <div className="ml-4 flex flex-col items-start justify-start">
            <h2 className="nobel-title flex flex-row text-[5rem] title text-center perspective-[1000px]">
              {['A', 'l', 'f', 'r', 'e', 'd', ' ', 'N', 'o', 'b', 'e', 'l'].map(
                (letter, index) => (
                  <p
                    key={index}
                    // @ts-ignore
                    ref={(el) => (alfRefs.current[index] = el)}
                    className="mx-3 transition-colors duration-300 cursor-default select-none"
                  >
                    {letter}
                  </p>
                ),
              )}
            </h2>
            <p className="nobel-text max-w-[80%] md:max-w-[70%]  p-4 md:p-6 md:pt-0  bg-white/90 backdrop-blur-md rounded-lg text-wrap text-lg">
              Alfred Nobel (1843-1821) was a Swedish chemist and inventor. He
              was a recipient of the Nobel Prize in Chemistry in 1895. Also
              known as the Father of Modern Chemistry, Nobel was a pioneer in
              the field of chemistry and made significant contributions to the
              development of the mordern understanding of science. The Nobel
              Prize is an annual award given to a person or organization for
              their discovery and contribution to the scientific community.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
