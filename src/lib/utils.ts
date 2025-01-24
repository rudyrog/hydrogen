import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatTimeSpent(timeSpent: number): string {
  console.log(timeSpent)
  // Convert to fixed number in case it's a string
  const totalMinutes = Math.round(Number(timeSpent))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return minutes <= 1 ? `${minutes} Min` : `${minutes} Mins`
  } else if (minutes === 0) {
    return hours === 1 ? `1 Hr` : `${hours} Hrs`
  } else {
    return `${hours} hr ${minutes} min`
  }
}
