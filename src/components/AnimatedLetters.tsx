"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

type AnimationConfig = {
  desktop: {
    initial?: gsap.TweenVars;
    animate?: gsap.TweenVars;
    stagger?: gsap.StaggerVars;
  };
  mobile: {
    initial?: gsap.TweenVars;
    animate?: gsap.TweenVars;
    stagger?: gsap.StaggerVars;
  };
};

interface AnimatedLettersProps {
  text: string;
  isMobile: boolean;
  className?: string;
  letterClassName?: string;
  withBlur?: boolean;
  animationConfig?: AnimationConfig;
  perspective?: string;
  letterSpacing?: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
  fontSize?: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

const defaultAnimationConfig: AnimationConfig = {
  desktop: {
    initial: {
      y: 100,
      opacity: 0,
      rotateX: -60,
      scale: 0.9,
    },
    animate: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      ease: "elastic.out(1.2, 0.8)",
      duration: 1.2,
    },
    stagger: {
      each: 0.08,
      ease: "power3.inOut",
    },
  },
  mobile: {
    initial: {
      y: 40,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      ease: "power3.out",
      duration: 0.8,
    },
    stagger: {
      each: 0.08,
      ease: "power3.inOut",
    },
  },
};

const AnimatedLetters = ({
  text,
  isMobile,
  className = "",
  letterClassName = "",
  withBlur = true,
  animationConfig = defaultAnimationConfig,
  perspective = "perspective-[1000px]",
  letterSpacing = {
    base: "mx-1",
    sm: "sm:mx-2",
    md: "md:mx-3",
    lg: "lg:mx-4",
  },
  fontSize = {
    base: "text-4xl",
    sm: "sm:text-4xl",
    md: "md:text-6xl",
    lg: "lg:text-8xl",
    xl: "xl:text-9xl",
  },
}: AnimatedLettersProps) => {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const initGSAP = async () => {
      gsap.registerPlugin(ScrollTrigger);
      const letters = text.split("");
      letterRefs.current = letterRefs.current.slice(0, letters.length);

      const config = isMobile
        ? animationConfig.mobile
        : animationConfig.desktop;

      const tl = gsap.timeline();

      // Main animation
      tl.fromTo(
        letterRefs.current,
        { ...config.initial },
        { ...config.animate, stagger: config.stagger }
      );

      // Optional blur effect for desktop
      if (!isMobile && withBlur) {
        tl.fromTo(
          letterRefs.current,
          { filter: "blur(12px)" },
          { filter: "blur(0px)", stagger: { each: 0.1, from: "start" } },
          "<0.05"
        );
      }
    };

    initGSAP();
  }, [text, isMobile, withBlur, animationConfig]);

  const letters = text.split("");
  const letterSpacingClasses = `${letterSpacing.base} ${letterSpacing.sm} ${letterSpacing.md} ${letterSpacing.lg}`;
  const fontSizeClasses = `${fontSize.base} ${fontSize.sm} ${fontSize.md} ${fontSize.lg} ${fontSize.xl}`;

  return (
    <div
      className={`flex flex-row items-center title justify-center flex-wrap ${perspective} ${fontSizeClasses} ${className}`}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          // @ts-ignore
          ref={(el) => (letterRefs.current[index] = el)}
          className={`${letterSpacingClasses} transition-colors duration-300 cursor-default select-none ${letterClassName}`}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default AnimatedLetters;
