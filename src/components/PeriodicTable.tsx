import elements from '@/data/elements.json'
import { Element } from '@/types/element'
import React from 'react'

const PeriodicTable: React.FC = () => {
  const ElementCard = ({ element }: { element: Element | undefined }) => {
    if (!element) return <div className="w-16 h-16 invisible" />

    return (
      <div
        className="w-16 h-16 p-1 text-center border rounded transition-transform hover:scale-105 cursor-pointer flex flex-col justify-between text-black"
        style={{
          backgroundColor: `#${element.CPKHexColor || '808080'}`,
          gridColumn: getGridColumn(element.AtomicNumber),
          gridRow: getGridRow(element.AtomicNumber),
        }}
      >
        <div className="text-xs">{element.AtomicNumber}</div>
        <div className="text-sm font-bold">{element.Symbol}</div>
        <div className="text-xs truncate">{element.Name}</div>
      </div>
    )
  }
  const renderLanthanidesAndActinides = () => {
    const lanthanides = elements.filter(
      (e) => e.AtomicNumber >= 57 && e.AtomicNumber <= 70,
    )
    const actinides = elements.filter(
      (e) => e.AtomicNumber >= 89 && e.AtomicNumber <= 102,
    )

    return (
      <div className="">
        <div className="flex justify-center gap-1 mt-1">
          {lanthanides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
        <div className="flex justify-center gap-1 mt-1">
          {actinides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
      </div>
    )
  }

  const getGridColumn = (atomicNumber: number): string => {
    if (atomicNumber === 1) return '1'
    if (atomicNumber === 2) return '18'

    if (
      atomicNumber === 3 ||
      atomicNumber === 11 ||
      atomicNumber === 19 ||
      atomicNumber === 37 ||
      atomicNumber === 55 ||
      atomicNumber === 87
    )
      return '1'
    if (
      atomicNumber === 4 ||
      atomicNumber === 12 ||
      atomicNumber === 20 ||
      atomicNumber === 38 ||
      atomicNumber === 56 ||
      atomicNumber === 88
    )
      return '2'

    if (atomicNumber >= 5 && atomicNumber <= 10) return String(atomicNumber + 8)
    if (atomicNumber >= 13 && atomicNumber <= 18) return String(atomicNumber)
    if (atomicNumber >= 31 && atomicNumber <= 36)
      return String(atomicNumber - 18)
    if (atomicNumber >= 49 && atomicNumber <= 54)
      return String(atomicNumber - 36)
    if (atomicNumber >= 81 && atomicNumber <= 86)
      return String(atomicNumber - 68)
    if (atomicNumber >= 113 && atomicNumber <= 118)
      return String(atomicNumber - 100)

    if (atomicNumber >= 21 && atomicNumber <= 30)
      return String(atomicNumber - 18)
    if (atomicNumber >= 39 && atomicNumber <= 48)
      return String(atomicNumber - 36)
    if (atomicNumber >= 71 && atomicNumber <= 80)
      return String(atomicNumber - 68)
    if (atomicNumber >= 103 && atomicNumber <= 112)
      return String(atomicNumber - 100)

    if (atomicNumber >= 57 && atomicNumber <= 70)
      return String(atomicNumber - 56)
    if (atomicNumber >= 89 && atomicNumber <= 102)
      return String(atomicNumber - 88)

    return '1'
  }

  const getGridRow = (atomicNumber: number): string => {
    if (atomicNumber <= 2) return '1'
    if (atomicNumber <= 10) return '2'
    if (atomicNumber <= 18) return '3'
    if (atomicNumber <= 36) return '4'
    if (atomicNumber <= 54) return '5'
    if (atomicNumber <= 86) return '6'
    if (atomicNumber <= 118) return '7'

    if (atomicNumber >= 57 && atomicNumber <= 70) return '9' // Lanthanides
    if (atomicNumber >= 89 && atomicNumber <= 102) return '10' // Actinides

    return '1'
  }

  return (
    <div className="">
      <div
        className="grid "
        style={{
          gridTemplateColumns: 'repeat(18, 4rem)',
          gridTemplateRows: 'repeat(7, 4rem)',
          gridGap: '0.08rem',
        }}
      >
        {elements.map((element) => (
          <ElementCard
            key={element.AtomicNumber}
            //@ts-ignore
            element={element}
          />
        ))}
      </div>
      {renderLanthanidesAndActinides()}
    </div>
  )
}

export default PeriodicTable
