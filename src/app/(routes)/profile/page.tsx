'use client'
import { auth } from '@/lib/firebase'
import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Profile() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const tableRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)
  const [user, setUser] = useState<null | { name: string }>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || 'User',
        })
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 7)

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
        tableRef.current,
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
        imageRef.current,
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
    <div className="flex gap-3 flex-col container mx-auto p-3 w-5/6">
      <h1 className="quiz-title flex flex-row text-7xl md:text-start text-center title pt-20">
        {['P', 'R', 'O', 'F', 'I', 'L', 'E'].map((letter, index) => (
          <p
            key={index}
            // @ts-ignore
            ref={(el) => (letterRefs.current[index] = el)}
            className="mx-3 transition-colors duration-300 cursor-default select-none"
          >
            {letter}
          </p>
        ))}
      </h1>
      <div className="p-5">
        <div className="flex flex-row justify-between">
          <div className="w-full">
            <div
              ref={tableRef}
              className="info-table w-full border border-black/30 text-lg"
            >
              <div className="bg-black/30 text-xl flex">
                <p className="flex-1 py-3 px-4 text-left">Field</p>
                <p className="flex-1 py-3 px-4 text-left">Details</p>
              </div>

              <div className="flex border-t">
                <p className="flex-1 py-2 px-4">Name</p>
                <p className="flex-1 py-2 px-4">{user?.name}</p>
              </div>

              <div className="flex border-t">
                <p className="flex-1 py-2 px-4">Email</p>
                <p className="flex-1 py-2 px-4">{auth.currentUser?.email}</p>
              </div>

              <div className="flex border-t">
                <p className="flex-1 py-2 px-4">Quiz's Attempted</p>
                <p className="flex-1 py-2 px-4">None</p>
              </div>

              <div className="flex border-t">
                <p className="flex-1 py-2 px-4">Quiz's Completed</p>
                <p className="flex-1 py-2 px-4">None</p>
              </div>
            </div>
          </div>
          <div
            ref={imageRef}
            className="w-full flex justify-around"
          >
            <Image
              width={400}
              height={400}
              src="/images/bonds.jpg"
              alt="Nobel"
              className="nobel-img border border-black-20 z-30"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
