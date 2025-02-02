import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeaderboard } from "@/lib/firebase/profileFunctions";
import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import CopyEmailButton from "./EmailButton";

export const Leaderboard = () => {
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
    <Card className="w-full border-border/10 dark:border-border/50 border-2 shadow-lg bg-background">
      <CardHeader className="p-2 sm:p-3 md:p-4 bg-foreground/10 border-b border rounded-t-md dark:border-border/20">
        <CardTitle className="subtitle font-normal flex items-center gap-2">
          <MdLeaderboard className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          <span className="text-foreground text-sm sm:text-base md:text-lg lg:text-xl font-[monty]">
            Leaderboard
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <p className="text-center text-sm sm:text-base md:text-lg text-foreground/50 p-2 sm:p-3 md:p-4">
            Loading...
          </p>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-border/30">
                  <TableHead className="text-left text-foreground/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                    Position
                  </TableHead>
                  <TableHead className="text-left text-foreground/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                    Name
                  </TableHead>
                  <TableHead className="text-left text-foreground/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base hidden sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="text-left text-foreground/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((profile, index) => (
                  <TableRow
                    key={index}
                    className="border-b dark:border-border/30 hover:bg-foreground/5 transition-colors"
                  >
                    <TableCell className="text-xl sm:text-2xl md:text-3xl p-2 sm:p-3">
                      {index + 1 === 1 ? (
                        <FaTrophy className="text-yellow-400 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                      ) : index + 1 === 2 ? (
                        <FaTrophy className="text-gray-400 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                      ) : index + 1 === 3 ? (
                        <FaTrophy className="text-amber-700 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                      ) : (
                        <span className="text-sm sm:text-base md:text-lg">
                          {index + 1}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                      {profile.nickname}
                    </TableCell>
                    <TableCell className="p-2 sm:p-3 hidden sm:table-cell">
                      <CopyEmailButton
                        email={profile.email}
                        //@ts-ignore
                        className="text-xs sm:text-sm md:text-base"
                      />
                    </TableCell>
                    <TableCell className="p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                      {profile.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-sm sm:text-base md:text-lg text-textSecondary p-2 sm:p-3 md:p-4">
            No data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
