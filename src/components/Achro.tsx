import React from "react";
import elementsData from "@/data/elements.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Element } from "@/types/element";

// Manually assigning column numbers based on the periodic table layout
const achroAsSentences = [
  "HeLiNa Ki Rab se Fariyad",
  "Beta Mange Car Scooter Baap Razi",
  "Second Year Layenge AC",
  "Tea Zara Half Dena",
  "Vo Navab tha",
  "Crore maal wala",
  "Man thanda Re",
  "Fir Rutha Osama",
  "Caun Rahegha Irregular",
  "Nahi Padhoge to Pitoge",
  "Cyu Age Aaoge",
  "Zindagi Cabaad Hogai",
  "Baigan Aalu Gajar in Thela",
  "KaSi gaye guru shankar Prabhu",
  "Nana Patekar , Asrani sab Bimaar",
  "Old Style se tea pio",
  "Fir Cal Bahar I aunty ko namaste",
  "Hema Nilam Aur Karishma Zaenge Rome",
];
const columnMapping = {
  1: [
    { atomicNumber: 1, text: "He" },
    { atomicNumber: 3, text: "Li" },
    { atomicNumber: 11, text: "Na" },
    { atomicNumber: 19, text: "Kare" },
    { atomicNumber: 37, text: "Rab" },
    { atomicNumber: 55, text: "Se" },
    { atomicNumber: 87, text: "Fariyad" },
  ], // H, Li, Na, K, Rb, Cs, Fr
  2: [
    { atomicNumber: 4, text: "Beta" },
    { atomicNumber: 12, text: "Mange" },
    { atomicNumber: 20, text: "Car" },
    { atomicNumber: 38, text: "Scooter" },
    { atomicNumber: 56, text: "Baap" },
    { atomicNumber: 88, text: "Raazi" },
  ], // Be, Mg, Ca, Sr, Ba, Ra
  3: [
    { atomicNumber: 21, text: "Second" },
    { atomicNumber: 39, text: "Year" },
    { atomicNumber: 57, text: "Layenge" },
    { atomicNumber: 89, text: "AC" },
  ], // Sc, Y, La, Ac
  4: [
    { atomicNumber: 22, text: "Tea" },
    { atomicNumber: 40, text: "Zara" },
    { atomicNumber: 72, text: "Half dena!" },
  ], // Ti, Zr, Hf, Rf
  5: [
    { atomicNumber: 23, text: "Vo" },
    { atomicNumber: 41, text: "Navab" },
    { atomicNumber: 73, text: "Tha" },
  ], // V, Nb, Ta, Db
  6: [
    { atomicNumber: 24, text: "Crore" },
    { atomicNumber: 42, text: "Maal" },
    { atomicNumber: 74, text: "Wala" },
  ], // Cr, Mo, W, Sg
  7: [
    { atomicNumber: 25, text: "Man" },
    { atomicNumber: 43, text: "thanda" },
    { atomicNumber: 75, text: "Re" },
  ], // Mn, Tc, Re, Bh
  8: [
    { atomicNumber: 26, text: "Fir" },
    { atomicNumber: 44, text: "Rutha" },
    { atomicNumber: 76, text: "Osama" },
  ], // Fe, Ru, Os, Hs
  9: [
    { atomicNumber: 27, text: "Kaun" },
    { atomicNumber: 45, text: "Rahegha" },
    { atomicNumber: 77, text: "Irregular" },
  ], // Co, Rh, Ir, Mt
  10: [
    { atomicNumber: 28, text: "Nahi" },
    { atomicNumber: 46, text: "Padhoge to" },
    { atomicNumber: 78, text: "Pitoge" },
  ], // Ni, Pd, Pt, Ds
  11: [
    { atomicNumber: 29, text: "Cyu" },
    { atomicNumber: 47, text: "Age" },
    { atomicNumber: 79, text: "Aaoge" },
  ], // Cu, Ag, Au, Rg
  12: [
    { atomicNumber: 30, text: "Zindagi" },
    { atomicNumber: 48, text: "Cabaad" },
    { atomicNumber: 80, text: "Hogai" },
  ], // Zn, Cd, Hg, Cn
  13: [
    { atomicNumber: 5, text: "Baigan" },
    { atomicNumber: 13, text: "Aalu" },
    { atomicNumber: 31, text: "Gajar" },
    { atomicNumber: 49, text: "in" },
    { atomicNumber: 81, text: "Thaila" },
  ], // B, Al, Ga, In, Tl, Nh
  14: [
    { atomicNumber: 6, text: "Ca" },
    { atomicNumber: 14, text: "Si" },
    { atomicNumber: 32, text: "Gaye" },
    { atomicNumber: 50, text: "Shankar" },
    { atomicNumber: 82, text: "Prabhu" },
  ], // C, Si, Ge, Sn, Pb, Fl
  15: [
    { atomicNumber: 7, text: "Nana" },
    { atomicNumber: 15, text: "Patekar" },
    { atomicNumber: 33, text: "Asrani" },
    { atomicNumber: 51, text: "Sab" },
    { atomicNumber: 83, text: "Bimaar" },
  ], // N, P, As, Sb, Bi, Mc
  16: [
    { atomicNumber: 8, text: "Old" },
    { atomicNumber: 16, text: "Style" },
    { atomicNumber: 34, text: "Se" },
    { atomicNumber: 52, text: "Tea" },
    { atomicNumber: 84, text: "Piyo" },
  ], // O, S, Se, Te, Po, Lv
  17: [
    { atomicNumber: 9, text: "Fir" },
    { atomicNumber: 17, text: "Cl" },
    { atomicNumber: 35, text: "Bahar" },
    { atomicNumber: 53, text: "I" },
    { atomicNumber: 85, text: "Aunty ko namaste" },
  ], // F, Cl, Br, I, At, Ts
  18: [
    { atomicNumber: 2, text: "Hema" },
    { atomicNumber: 10, text: "Nilam" },
    { atomicNumber: 18, text: "Aur" },
    { atomicNumber: 36, text: "Krishma" },
    { atomicNumber: 54, text: "Zaenge" },
    { atomicNumber: 86, text: "Rome" },
  ], // He, Ne, Ar, Kr, Xe, Rn, Og
};

const elements: Element[] = elementsData as Element[];

const groupedElements: Record<string, { element: Element; text: string }[]> =
  {};
Object.entries(columnMapping).forEach(([column, elementsWithText]) => {
  groupedElements[column] = elementsWithText
    .map(({ atomicNumber, text }) => {
      const element = elements.find((el) => el.AtomicNumber === atomicNumber);
      return { element, text };
    })
    .filter(({ element }) => element !== undefined) as {
    element: Element;
    text: string;
  }[];
});

export default function Achro() {
  return (
    <div>
      <Carousel className="border-none">
        <CarouselContent className="border-none">
          {Object.entries(groupedElements).map(([column, elementsWithText]) => (
            <CarouselItem key={column} className="p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Column {column}</h2>
              <ul className="flex flex-col items-start space-y-2">
                {elementsWithText.map(({ element, text }) =>
                  text != "" || text != null ? (
                    <div
                      key={element.AtomicNumber}
                      className="flex justify-center items-center gap-3"
                    >
                      <br />
                      <li className="border p-2 rounded-md text-center ">
                        <span className="font-semibold">{element.Symbol}</span>
                      </li>
                      {element.Name} - {text}
                    </div>
                  ) : (
                    ""
                  ),
                )}
              </ul>
              {/* @ts-ignore*/}
              {achroAsSentences[column - 1]}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
