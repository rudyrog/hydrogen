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
const columnMapping = {
  1: [1, 3, 11, 19, 37, 55, 87], // H, Li, Na, K, Rb, Cs, Fr
  2: [4, 12, 20, 38, 56, 88], // Be, Mg, Ca, Sr, Ba, Ra
  3: [21, 39, 57, 89], // Sc, Y, La, Ac
  4: [22, 40, 72, 104], // Ti, Zr, Hf, Rf
  5: [23, 41, 73, 105], // V, Nb, Ta, Db
  6: [24, 42, 74, 106], // Cr, Mo, W, Sg
  7: [25, 43, 75, 107], // Mn, Tc, Re, Bh
  8: [26, 44, 76, 108], // Fe, Ru, Os, Hs
  9: [27, 45, 77, 109], // Co, Rh, Ir, Mt
  10: [28, 46, 78, 110], // Ni, Pd, Pt, Ds
  11: [29, 47, 79, 111], // Cu, Ag, Au, Rg
  12: [30, 48, 80, 112], // Zn, Cd, Hg, Cn
  13: [5, 13, 31, 49, 81, 113], // B, Al, Ga, In, Tl, Nh
  14: [6, 14, 32, 50, 82, 114], // C, Si, Ge, Sn, Pb, Fl
  15: [7, 15, 33, 51, 83, 115], // N, P, As, Sb, Bi, Mc
  16: [8, 16, 34, 52, 84, 116], // O, S, Se, Te, Po, Lv
  17: [9, 17, 35, 53, 85, 117], // F, Cl, Br, I, At, Ts
  18: [2, 10, 18, 36, 54, 86, 118], // He, Ne, Ar, Kr, Xe, Rn, Og
};
const elements: Element[] = elementsData as Element[];
const groupedElements: Record<string, Element[]> = {};
Object.entries(columnMapping).forEach(([column, atomicNumbers]) => {
  groupedElements[column] = elements.filter((el) =>
    atomicNumbers.includes(el.AtomicNumber)
  );
});

export default function Achro() {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {Object.entries(groupedElements).map(([column, elements]) => (
            <CarouselItem key={column} className="p-4 border rounded-lg">
              <h2 className="text-xl font-bold mb-2">Column {column}</h2>
              <ul className="flex flex-col items-start space-y-2">
                {elements.map((el) => (
                  <div key={el.AtomicNumber} className="flex justify-center items-center gap-3">
                    <br />
                    <li className="border p-2 rounded-md text-center ">
                      <span className="font-semibold">{el.Symbol}</span>
                    </li>
                    {el.Name}
                    - 
                  </div>
                ))}
              </ul>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
