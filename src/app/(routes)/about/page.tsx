'use client'
import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function About() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const contentRef = useRef(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])

  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 5)
    imagesRef.current = imagesRef.current.slice(0, 2)

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
        contentRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5',
      )

      .fromTo(
        imagesRef.current,
        {
          opacity: 0,
          x: 100,
          rotateY: 15,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.8',
      )
  }, [])

  return (
    <div>
      <div className="flex gap-3 flex-col container mx-auto p-3 w-5/6">
        <h1 className="about-title flex flex-row text-7xl md:text-start text-center title pt-20">
          {['A', 'B', 'O', 'U', 'T'].map((letter, index) => (
            <p
              key={index}
              //@ts-ignore
              ref={(el) => (letterRefs.current[index] = el)}
              className="mx-3 transition-colors duration-300 cursor-default select-none"
            >
              {letter}
            </p>
          ))}
        </h1>
        <div className="flex flex-row gap-3 justify-between w-full">
          <div
            ref={contentRef}
            className="w-2/5 border border-black/30 p-5"
          >
            <h2 className="text-xl font-serif">Chemistry</h2>
            <div className="w-full">
              <p>
                It is a branch of science that studies the properties and
                behavior of matter, including the composition, structure, and
                behavior of atoms, molecules, and ions.
              </p>
            </div>
            <h2 className="text-xl font-serif mt-2">Development</h2>
            <p>
              This is a project created by{' '}
              <a
                href="https://github.com/rudyrog"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Rudra Mehta
              </a>{' '}
              and{' '}
              <a
                href="https://github.com/parv141206"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Parv Shah
              </a>
              .
            </p>
            <p>
              Support our project on{' '}
              <a
                href="https://github.com/rudyrog/periodic-table"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                GitHub
              </a>
              .
            </p>
            <div className="mt-2">
              <p className="font-serif text-lg">Technologies Used</p>
              <ul className="list-disc list-inside">
                <li>
                  <a
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ab-link"
                  >
                    Next.js
                  </a>
                </li>
                <li>
                  <a
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ab-link"
                  >
                    TailwindCSS
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.typescriptlang.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ab-link"
                  >
                    TypeScript
                  </a>
                </li>
                <li>
                  <a
                    href="https://gsap.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ab-link"
                  >
                    Gsap
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-2/3 flex flex-row justify-evenly gap-2">
            <Image
              width={370}
              height={200}
              src="/images/mercury.jpg"
              alt="Mercury"
              className="border border-black-20"
              //@ts-ignore
              ref={(el) => (imagesRef.current[0] = el as HTMLImageElement)}
            />
            <Image
              width={400}
              height={200}
              src="/images/test-tube.jpg"
              alt="test tube"
              className="border border-black-20"
              //@ts-ignore
              ref={(el) => (imagesRef.current[1] = el as HTMLImageElement)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
