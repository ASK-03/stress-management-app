"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Replace with your input component
import { createChannel } from "@/lib/queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react"; // Import icons

const CreateChannel = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelName, setChannelName] = useState("");

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      toast("Channel name cannot be empty!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await createChannel(userId, channelName);
      toast("Channel created successfully!");
      router.push(
        `/${userId}/channel/${response?.id}/?channelName=${channelName}`
      );
    } catch (error) {
      toast("Failed to create channel. Please try again.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <Card className="min-w-[30vw] min-h-[30vh] p-4 rounded-lg">
      <CardHeader>
        <h1 className="text-xl font-semibold">
          Feeling like helping someone? Create a channel to get connected.
        </h1>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5 text-blue-500" /> Create Channel
        </Button>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="p-6 rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Create a New Channel
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <p className="">
                  Enter the name of the channel you want to create:
                </p>
                <Input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Channel Name"
                  disabled={isLoading}
                  className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <DialogFooter className="flex justify-between gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4 text-red-500" /> Cancel
                </Button>
                <Button
                  onClick={handleCreateChannel}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">🔄</span> Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Create Channel
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateChannel;
