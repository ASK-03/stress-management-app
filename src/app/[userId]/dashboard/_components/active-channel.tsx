"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getActiveChannels } from "@/lib/queries";
import { Channels } from "@prisma/client";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ActiveChannels = ({ userId }: { userId: string }) => {
  const [channels, setChannels] = useState<Channels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch channels
    const fetchChannels = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedChannels = await getActiveChannels(userId);
        setChannels(fetchedChannels ?? []);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
        setError("Failed to load active channels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchChannels();

    // Set up interval to fetch every 5 seconds
    const intervalId = setInterval(() => {
      fetchChannels();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]); // Dependency array ensures the fetch is triggered if the `userId` changes

  return (
    <Card className="min-w-[30vw] max-h-[30vh] p-4 rounded-lg">
      <CardHeader className="font-semibold text-lg text-center">
        Active Channels
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-scroll">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />{" "}
            {/* You can customize the spinner size */}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : channels.length > 0 ? (
          channels.map((channel, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md mb-2 hover:bg-gray-100 transition-all duration-200"
            >
              <Link
                href={`/${userId}/channel/${channel.id}?channelName=${channel.name}`}
                className="text-blue-600 hover:underline"
              >
                {channel.name}
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">No active channels</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveChannels;
