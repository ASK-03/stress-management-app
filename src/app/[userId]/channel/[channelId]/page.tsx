"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { useEffect, useState } from "react";
import { Track } from "livekit-client";
import { useUser } from "@clerk/nextjs";
import { faker } from "@faker-js/faker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { submitReviewForChannel } from "@/lib/queries";

interface Props {
  params: {
    channelId: string;
    channelName: string;
  };
}

export default function Page({ params: { channelId } }: Props) {
  const { user } = useUser();
  if (!user) {
    return <div>Unauthorized</div>;
  }

  const router = useRouter();
  const channelName = useSearchParams().get("channelName") || "";
  const room = channelId;
  const name = `${faker.person.firstName()} ${faker.person.lastName()}`;

  // Declare hooks at the top
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // State to track star rating

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${room}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    };

    fetchToken();
  }, [name, room]);

  const handleDisconnect = () => {
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    try {
      await submitReviewForChannel(
        channelId,
        user.id,
        rating,
        review
      );
      setIsModalOpen(false);
      router.push(`/${user.id}/dashboard`);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < rating;
      return (
        <span
          key={index}
          onClick={() => setRating(index + 1)}
          className="cursor-pointer text-yellow-500 text-3xl"
        >
          {isFilled ? <AiFillStar /> : <AiOutlineStar />}
        </span>
      );
    });
  };

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <Card className="h-[750px]">
      <CardHeader>
        <CardTitle>{channelName}</CardTitle>
      </CardHeader>
      <CardContent>
        <LiveKitRoom
          video={false}
          audio={false}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: "70dvh" }}
          onDisconnected={handleDisconnect}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </LiveKitRoom>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave a Review</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center mb-4">{renderStars()}</div>
              <Textarea
                placeholder="Share your feedback..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="mt-2"
              />
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleReviewSubmit}>Submit Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
