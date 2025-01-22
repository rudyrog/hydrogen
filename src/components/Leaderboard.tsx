import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getLeaderboard } from '@/lib/firebase/profileFunctions'
import React, { useEffect, useState } from 'react'
import { FaTrophy } from 'react-icons/fa'
import { MdLeaderboard } from 'react-icons/md'

interface LeaderboardProps {
  onEmailClick?: (email: string) => void
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onEmailClick }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<
    | {
        email: string
        classicQuizCompleted: number
        guessTheLocationCompleted: number
        totalScore: number
        points: number
        nickname: string
      }[]
    | null
  >(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard()
        setLeaderboard(leaderboardData)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <Card className="w-full bg-cardBackground text-cardForeground">
      <CardHeader className="p-4 bg-foreground/10 border-b">
        <CardTitle className="subtitle text-headerForeground font-normal flex items-center gap-2">
          <MdLeaderboard />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <p className="text-center text-lg text-foreground/50 p-4">
            Loading...
          </p>
        ) : leaderboard && leaderboard.length > 0 ? (
          <Table>
            <TableHeader className="p-3">
              <TableRow>
                <TableHead className="text-left text-foreground/50">
                  Position
                </TableHead>
                <TableHead className="text-left text-foreground/50">
                  Name
                </TableHead>
                <TableHead className="text-left text-foreground/50">
                  Email
                </TableHead>
                <TableHead className="text-left text-foreground/50">
                  Score
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((profile, index) => (
                <TableRow key={index}>
                  <TableCell className="text-2xl text-center text-textPrimary">
                    {index + 1 === 1 ? (
                      <FaTrophy className="text-yellow-400" />
                    ) : index + 1 === 2 ? (
                      <FaTrophy className="text-gray-400" />
                    ) : index + 1 === 3 ? (
                      <FaTrophy className="text-amber-700" />
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell className="text-textPrimary">
                    {profile.nickname}
                  </TableCell>
                  <TableCell>
                    {onEmailClick ? (
                      <button
                        onClick={() => onEmailClick(profile.email)}
                        className="text-textSecondary hover:text-blue-800 hover:underline focus:outline-none"
                      >
                        {profile.email}
                      </button>
                    ) : (
                      profile.email
                    )}
                  </TableCell>
                  <TableCell className="text-textPrimary">
                    {profile.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-lg text-textSecondary">
            No data available.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
