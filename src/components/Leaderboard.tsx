import { getLeaderboard } from "@/lib/firebase/profileFunctions";
import { FaTrophy } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdLeaderboard } from "react-icons/md";

interface LeaderboardProps {
  onEmailClick?: (email: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onEmailClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<
    | {
        email: string;
        classicQuizCompleted: number;
        guessTheLocationCompleted: number;
        totalScore: number;
        points: number;
        nickname: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Card className="w-full">
 <CardHeader className="p-4 bg-slate-50 border-b">
        <CardTitle className="subtitle text-slate-800 font-normal flex items-center gap-2">
        <MdLeaderboard/>
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : leaderboard && leaderboard.length > 0 ? (
          <Table>
            <TableHeader className='p-3'>
              <TableRow>
                <TableHead className="text-left">Position</TableHead>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-left">Email</TableHead>
                <TableHead className="text-left">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((profile, index) => (
                <TableRow key={index}>
                  <TableCell className="text-2xl text-center">
                    {index + 1 === 1 ? (
                      <FaTrophy className="text-yellow-400" />
                    ) : index + 1 === 2 ? (
                      <FaTrophy className="text-gray-400" />
                    ) : index + 1 === 3 ? (
                      <FaTrophy className="text-amber-700 " />
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell>{profile.nickname}</TableCell>
                  <TableCell>
                    {onEmailClick ? (
                      <button
                        onClick={() => onEmailClick(profile.email)}
                        className="text-slate-600 hover:text-blue-800 hover:underline focus:outline-none"
                      >
                        {profile.email}
                      </button>
                    ) : (
                      profile.email
                    )}
                  </TableCell>
                  <TableCell>{profile.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-lg">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
};