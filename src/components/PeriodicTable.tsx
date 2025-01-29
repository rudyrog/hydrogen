import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import elements from "@/data/elements.json";
import { Element } from "@/types/element";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import AtomModel from "./AtomModel";

const PeriodicTable = ({
  highlighted,
  normal,
  half,
}: {
  highlighted?: Array<number>;
  normal: boolean;
  half?: boolean;
}) => {
  const [selectedElement, setSelectedElement] = React.useState<Element | null>(
    null,
  );
  const { theme } = useTheme();
  const ElementCard = ({
    element,
    normal,
    highlighted,
  }: {
    element: Element;
    normal: boolean;
    highlighted?: boolean;
  }) => {
    if (!element) return <div className="w-16 h-16 invisible" />;

    return (
      <DrawerTrigger asChild>
        <div
          className={`md:w-16 ${
            normal === false
              ? highlighted === true
                ? "opacity-100 border-black border-2"
                : "opacity-25"
              : ""
          } md:h-16 h-12 w-12 p-1 text-center border border-border/20  rounded transition-transform hover:scale-105 cursor-pointer flex flex-col justify-between ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
          style={{
            backgroundColor: `#${
              theme === "dark" && element.CPKHexColor
                ? ((r, g, b) => {
                    const lightenFactor = 0.3;
                    return [
                      Math.min(255, Math.round(parseInt(r, 16) * lightenFactor))
                        .toString(16)
                        .padStart(2, "0"),
                      Math.min(255, Math.round(parseInt(g, 16) * lightenFactor))
                        .toString(16)
                        .padStart(2, "0"),
                      Math.min(255, Math.round(parseInt(b, 16) * lightenFactor))
                        .toString(16)
                        .padStart(2, "0"),
                    ].join("");
                  })(
                    element.CPKHexColor.slice(0, 2),
                    element.CPKHexColor.slice(2, 4),
                    element.CPKHexColor.slice(4, 6),
                  )
                : element.CPKHexColor || "808080"
            }`,
            gridColumn: getGridColumn(element.AtomicNumber),
            gridRow: getGridRow(element.AtomicNumber),
          }}
          onClick={() => setSelectedElement(element)}
        >
          <div className="text-xs">{element.AtomicNumber}</div>
          <div className="text-sm font-bold">{element.Symbol}</div>
          <div className="text-xs truncate">{element.Name}</div>
        </div>
      </DrawerTrigger>
    );
  };

  const ElementDetails = ({ element }: { element: Element | null }) => {
    if (!element) return null;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-center w-8 h-2 bg-gray-400 rounded-lg"></div>
        <div className="flex md:flex-row flex-col overflow-y-scroll h-[80vh] md:justify-around px-40">
          <div className="md:container md:mx-auto md:flex flex-col items-sart justify-start  py-3">
            <DrawerHeader>
              <DrawerTitle className="text-2xl">
                {element.Name} ({element.Symbol})
              </DrawerTitle>
              <DrawerDescription>
                Atomic Number: {element.AtomicNumber}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 flex items-center justify-center">
              <div className="md:grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Basic Info</h3>
                  <ul className="space-y-2">
                    <li>Atomic Mass: {element.AtomicMass}</li>
                    <li>
                      Electronic Configuration: {element.ElectronConfiguration}
                    </li>
                    <li>Electronegativity: {element.Electronegativity}</li>
                    <li>Oxidation States: {element.OxidationStates}</li>
                    <div>
                      <h3 className="font-semibold">Year Discovered</h3>
                      <p className="mt-2">{element.YearDiscovered}</p>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
          <AtomModel elementData={element} />
        </div>
      </div>
    );
  };

  const renderLanthanidesAndActinides = () => {
    const lanthanides = elements.filter(
      (e) => e.AtomicNumber >= 57 && e.AtomicNumber <= 70,
    );
    const actinides = elements.filter(
      (e) => e.AtomicNumber >= 89 && e.AtomicNumber <= 102,
    );

    return (
      <div className="mt-8 flex flex-col w-screen items-center justify-center">
        <div className="flex justify-center gap-1 md:ms-0 ms-[30rem] mt-1">
          {lanthanides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
        <div className="flex justify-center  md:ms-0 ms-[30rem]  gap-1 mt-1">
          {actinides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore

              element={element}
            />
          ))}
        </div>
      </div>
    );
  };

  const getGridColumn = (atomicNumber: number): string => {
    if (atomicNumber === 1) return "1";
    if (atomicNumber === 2) return "18";
    if ([3, 11, 19, 37, 55, 87].includes(atomicNumber)) return "1";
    if ([4, 12, 20, 38, 56, 88].includes(atomicNumber)) return "2";
    if (atomicNumber >= 5 && atomicNumber <= 10)
      return String(atomicNumber + 8);
    if (atomicNumber >= 13 && atomicNumber <= 18) return String(atomicNumber);
    if (atomicNumber >= 31 && atomicNumber <= 36)
      return String(atomicNumber - 18);
    if (atomicNumber >= 49 && atomicNumber <= 54)
      return String(atomicNumber - 36);
    if (atomicNumber >= 81 && atomicNumber <= 86)
      return String(atomicNumber - 68);
    if (atomicNumber >= 113 && atomicNumber <= 118)
      return String(atomicNumber - 100);
    if (atomicNumber >= 21 && atomicNumber <= 30)
      return String(atomicNumber - 18);
    if (atomicNumber >= 39 && atomicNumber <= 48)
      return String(atomicNumber - 36);
    if (atomicNumber >= 71 && atomicNumber <= 80)
      return String(atomicNumber - 68);
    if (atomicNumber >= 103 && atomicNumber <= 112)
      return String(atomicNumber - 100);
    if (atomicNumber >= 57 && atomicNumber <= 70)
      return String(atomicNumber - 56);
    if (atomicNumber >= 89 && atomicNumber <= 102)
      return String(atomicNumber - 88);
    return "1";
  };

  const getGridRow = (atomicNumber: number): string => {
    if (atomicNumber <= 2) return "1";
    if (atomicNumber <= 10) return "2";
    if (atomicNumber <= 18) return "3";
    if (atomicNumber <= 36) return "4";
    if (atomicNumber <= 54) return "5";
    if (atomicNumber <= 86) return "6";
    if (atomicNumber <= 118) return "7";
    if (atomicNumber >= 57 && atomicNumber <= 70) return "9";
    if (atomicNumber >= 89 && atomicNumber <= 102) return "10";
    return "1";
  };

  return (
    <Drawer>
      <div className="p-4 md:flex items-center justify-center flex-col">
        <div
          className="grid md:gap-[0.25rem] gap-[0.1px]"
          style={{
            gridTemplateColumns: "repeat(18, 4rem)",
            gridTemplateRows: "repeat(7, 4rem)",
            //gridGap: '0.25rem',
          }}
        >
          {elements
            .filter(
              (element) =>
                element.AtomicNumber < 57 || element.AtomicNumber > 70,
            )
            .filter(
              (element) =>
                element.AtomicNumber < 89 || element.AtomicNumber > 102,
            )
            .map((element) => (
              <ElementCard
                key={element.AtomicNumber}
                normal={normal}
                highlighted={highlighted?.includes(element.AtomicNumber)}
                //@ts-ignore
                element={element}
              />
            ))}
        </div>
        <div className="md:p-0 px-20 w-full flex items-center justify-center">
          {half === false || half === undefined || half === null
            ? renderLanthanidesAndActinides()
            : ""}
        </div>
        <DrawerContent>
          <ElementDetails element={selectedElement} />
        </DrawerContent>
      </div>
    </Drawer>
  );
};

export default PeriodicTable;
