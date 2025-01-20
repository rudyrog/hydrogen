'use client'
import Particles from '@/components/ui/particles'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function Home() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const alfRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const marieRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    letterRefs.current = letterRefs.current.slice(0, 8)
    alfRefs.current = alfRefs.current.slice(0, 13)
    marieRefs.current = marieRefs.current.slice(0, 13)

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
    const marieTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#marie-section',
        start: 'top center',
        end: 'top 20%',
        scrub: 1,
      },
    })

    marieTimeline
      .fromTo(
        marieRefs.current,
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
        '.marie-img',
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
        '.marie-text',
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

    marieTimeline.fromTo(
      [marieRefs.current, '.marie-img', '.marie-text'],
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
        <div className="p-2 md:p-3 backdrop-blur-md rounded-lg text-black/30 mt-6">
          Scroll For More
        </div>
      </section>
      <section
        id="nobel-section"
        className="px-8  md:px-20 bg-white/90 text-black w-full flex flex-row items-center justify-center min-h-screen -mt-60"
      >
        <div className="flex flex-row w-full pt-12 justify-between">
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
              Alfred Nobel (1833-1896) was a Swedish chemist, inventor, and
              businessman whose complex legacy shaped the course of both science
              and peace advocacy. Most famous for inventing{' '}
              <strong>Dynamite</strong> in 1867, Nobel's work with explosives
              revolutionized both mining and warfare. Born in Stockholm to an
              engineering family, Nobel showed early brilliance in chemistry and
              engineering. Despite having no formal university education, he
              became one of the most successful inventors of his time,
              accumulating 355 patents across multiple countries. His most
              significant invention, dynamite, made construction and mining
              safer by providing a more stable alternative to highly volatile
              nitroglycerin.
            </p>
          </div>
        </div>
      </section>
      <section
        id="marie-section"
        className="px-8  md:px-20 bg-white/90 text-black w-full flex flex-row items-center justify-center min-h-screen -mt-40"
      >
        <div className="flex flex-row h-fit w-full pt-12 justify-between">
          <Image
            width={400}
            height={400}
            src="/images/marie.jpg"
            alt="Nobel"
            className="marie-img border border-black-20 z-30"
          />
          <div className="ml-4 flex flex-col items-start justify-start">
            <h2 className="marie-title flex flex-row text-[5rem] title text-center perspective-[1000px]">
              {['M', 'a', 'r', 'i', 'e', ' ', 'C', 'u', 'r', 'i', 'e'].map(
                (letter, index) => (
                  <p
                    key={index}
                    // @ts-ignore
                    ref={(el) => (marieRefs.current[index] = el)}
                    className="mx-3 transition-colors duration-300 cursor-default select-none"
                  >
                    {letter}
                  </p>
                ),
              )}
            </h2>
            <p className="marie-text max-w-[80%] md:max-w-[70%]  p-4 md:p-6 md:pt-0  bg-white/90 backdrop-blur-md rounded-lg text-wrap text-lg">
              Marie Curie (1867-1934) was a pioneering physicist and chemist
              whose groundbreaking research on radioactivity transformed our
              understanding of matter and energy. The first woman to win a Nobel
              Prize and the only person to win in multiple scientific fields
              (Physics and Chemistry), Curie's discoveries revolutionized both
              science and medicine. Born Maria Skłodowska in Warsaw, Poland,
              Curie overcame significant barriers as a woman in science,
              eventually becoming the first female professor at the Sorbonne in
              Paris. Despite facing poverty and gender discrimination, she
              conducted meticulous research that led to the discovery of two new
              elements, <strong>Olonium</strong> and <strong> Radium</strong>,
              and developed techniques for isolating radioactive isotopes that
              laid the foundation for modern radiation therapy.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
