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
import { useEffect, useState } from 'react'
import { FaTrophy } from 'react-icons/fa'
import { MdLeaderboard } from 'react-icons/md'
import CopyEmailButton from './EmailButton'

export const Leaderboard = () => {
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
    <Card className="w-full border-border/10 dark:border-border/50 border-2">
      <CardHeader className="p-4 bg-foreground/10 border-b border rounded-t-md dark:border-border/20">
        <CardTitle className="subtitle font-normal flex items-center gap-2">
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
              <TableRow className="border-b dark:border-border/30">
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
                <TableRow
                  key={index}
                  className="border-b dark:border-border/30"
                >
                  <TableCell className="text-2xl text-center">
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
                  <TableCell className="text-foreground">
                    {profile.nickname}
                  </TableCell>
                  <TableCell>
                    <CopyEmailButton email={profile.email} />
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
