"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActiveChannels from "./_components/active-channel";
import { useUserContext } from "@/providers/user-type-provider";
import CreateChannel from "./_components/create-channel";
import UsersActiveChannels from "./_components/users-active-channel";
import RewardCard from "./_components/reward-card";
import { cn } from "@/lib/utils";
import RewardsGraph from "./_components/rewards-graph";
import { useEffect, useState } from "react";
import { getRewardsData } from "@/lib/queries";

type Props = {
  params: {
    userId: string;
  };
};

type RewardData = {
  date: string;
  totalRating: number;
  reviewCount: number;
};

export default function Page({ params: { userId } }: Props) {
  const { userState } = useUserContext();
  const [userRewardsData, setUserRewardsData] = useState<RewardData[]>([]);

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        const data = await getRewardsData(userId);
        setUserRewardsData(data || []);
      } catch (error) {
        console.error("Error fetching rewards data:", error);
      }
    };

    fetchRewardsData();
  }, [userId]);

  return (
    <Card className="h-[750px]">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          className={cn(
            "flex gap-4 flex-col flex-1",
            userState === "Need Help" && "flex-row"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-4 flex-1",
              userState === "Volunteer" && "flex-row"
            )}
          >
            {/* Create Channel or Active Channels depending on userState */}
            {userState === "Volunteer" && <CreateChannel userId={userId} />}
            {userState === "Need Help" && <ActiveChannels userId={userId} />}
            {/* Users Active Channels for Volunteers */}
            {userState === "Volunteer" && (
              <UsersActiveChannels userId={userId} />
            )}
          </div>
          {/* Reward Card Section */}
          <div className="flex gap-4">
            <RewardCard userId={userId} />
            {userState === "Volunteer" && (
              <RewardsGraph rewardsData={userRewardsData} />
            )}
          </div>
        </div>
        {userState === "Need Help" && (
          <RewardsGraph rewardsData={userRewardsData} />
        )}
      </CardContent>
    </Card>
  );
}
