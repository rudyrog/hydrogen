import React from "react";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowDownRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PeriodicTable from "../PeriodicTable";

const trends = [
  {
    name: "Trend 1: Electronegativity",
    description:
      "Electronegativity increases across a period (left to right) and decreases down a group (top to bottom). The ability of an atom to attract electrons.",
    details:
      "🌍 **Fun fact:** Electronegativity is like the 'attraction power' of atoms! Fluorine is the most electronegative element. It's so good at attracting electrons, it could make any atom jealous!",
  },
  {
    name: "Trend 2: Atomic Radius",
    description:
      "Atomic radius decreases across a period and increases down a group. This shows the size of an atom.",
    details:
      "🧑‍🔬 **Interesting tidbit:** As you go across a period, atoms get smaller because their electrons are more tightly pulled in by the nucleus. But when you go down a group, atoms get bigger as more electron shells are added!",
  },
  {
    name: "Trend 3: Ionization Energy",
    description:
      "Ionization energy increases across a period and decreases down a group. This is the energy required to remove an electron from an atom.",
    details:
      "💡 **Cool fact:** Ionization energy is like the 'kick' an atom gives to an electron when it wants to get rid of it. The further right you go in a period, the harder it is to remove an electron!",
  },
  {
    name: "Trend 4: Metallic Character",
    description:
      "Metallic character decreases across a period and increases down a group. Elements with metallic properties are good conductors of heat and electricity.",
    details:
      "⚙️ **Did you know?** Metallic character is all about being shiny and good at conducting electricity! As you move across the table, metals become less 'metal-like' until you reach the nonmetals!",
  },
];

const TrendArrows = ({ selectedTrend }) => {
  const getArrowColor = (increasing) => {
    return increasing ? "text-green-500" : "text-red-500";
  };

  const renderArrows = () => {
    switch (selectedTrend) {
      case 0: // Electronegativity
        return (
          <>
            <div className="absolute top-8 right-4">
              <ArrowRight
                className={`w-12 text-5xl h-12 ${getArrowColor(true)}`}
              />
              <span className="text-xs">Increases </span>
            </div>
            <div className="absolute top-16 left-4">
              <ArrowDown className={`w-12 h-12 ${getArrowColor(false)}`} />
              <span className="text-xs">Decreases </span>
            </div>
          </>
        );
      case 1: // Atomic Radius
        return (
          <>
            <div className="absolute top-8 right-4">
              <ArrowRight className={`w-12 h-12 ${getArrowColor(false)}`} />
              <span className="text-xs">Decreases →</span>
            </div>
            <div className="absolute top-16 left-4">
              <ArrowDown className={`w-12 h-12 ${getArrowColor(true)}`} />
              <span className="text-xs">Increases ↓</span>
            </div>
          </>
        );
      case 2: // Ionization Energy
        return (
          <>
            <div className="absolute top-8 right-4">
              <ArrowRight className={`w-12 h-12 ${getArrowColor(true)}`} />
              <span className="text-xs">Increases →</span>
            </div>
            <div className="absolute top-16 left-4">
              <ArrowDown className={`w-12 h-12 ${getArrowColor(false)}`} />
              <span className="text-xs">Decreases ↓</span>
            </div>
          </>
        );
      case 3: // Metallic Character
        return (
          <>
            <div className="absolute top-8 right-4">
              <ArrowRight className={`w-12 h-12 ${getArrowColor(false)}`} />
              <span className="text-xs">Decreases →</span>
            </div>
            <div className="absolute top-16 left-4">
              <ArrowDown className={`w-12 h-12 ${getArrowColor(true)}`} />
              <span className="text-xs">Increases ↓</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return <div className="relative">{renderArrows()}</div>;
};

export default function Trends() {
  const [selectedTrend, setSelectedTrend] = useState<number>(0);

  return (
    <div className="relative">
      <div className="mt-2">
        <Select
          defaultValue={String(0)}
          onValueChange={(value) => setSelectedTrend(Number(value))}
        >
          <SelectTrigger className="w-fit gap-4 text-lg body text-foreground shadow-md rounded-lg bg-background border border-border outline-none">
            <SelectValue placeholder="Select Trend" />
          </SelectTrigger>
          <SelectContent  className="bg-background border border-border shadow-md backdrop-blur-sm">
            {trends.map((trend, index) => (
              <SelectItem key={index} value={String(index)} className="hover:bg-foreground/20 transition-colors duration-300">
                {trend.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        {selectedTrend !== null && (
          <div>
            <h2 className="text-xl font-semibold">
              {trends[selectedTrend].name}
            </h2>
            <p className="mt-2">{trends[selectedTrend].description}</p>
            <p className="text-gray-600 font-medium mt-2">
              {trends[selectedTrend].details}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 relative">
        <TrendArrows selectedTrend={selectedTrend} />
        <PeriodicTable normal={false} half={true} />
      </div>
    </div>
  );
}
