"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRewards } from "@/lib/queries";
import { ShowRewards } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, Star } from "lucide-react"; // Importing Lucide icons

type Props = {
  userId: string;
};

const RewardCard = ({ userId }: Props) => {
  const [rewards, setRewards] = useState<ShowRewards>({
    weeklyRewards: 0,
    monthlyRewards: 0,
    yearlyRewards: 0,
  });

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewards: ShowRewards = await getRewards(userId);
        setRewards(rewards);
      } catch (error) {
        console.error("Failed to fetch rewards:", error);
      }
    };

    fetchRewards();
  }, [userId]);

  return (
    <Card className="min-w-[30vw] min-h-[30vh] p-4 rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">Rewards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Star className="text-yellow-400" />
          <p className="text-lg">
            You have earned <strong>{rewards.weeklyRewards}</strong> points this
            week!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-400" />
          <p className="text-lg">
            You have earned <strong>{rewards.monthlyRewards}</strong> points
            this month!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="text-green-400" />
          <p className="text-lg">
            You have earned <strong>{rewards.yearlyRewards}</strong> points this
            year!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
