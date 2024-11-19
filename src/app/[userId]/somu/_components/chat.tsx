"use client";

import { Message, useChat } from "ai/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Bot, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  userId: string;
  initialMessages: Message[];
};

const Chat = ({ userId, initialMessages }: Props) => {
  if (initialMessages === undefined) {
    initialMessages = [];
  }
  const { messages, handleInputChange, handleSubmit, input } = useChat({
    body: { userId: userId },
    initialMessages,
  });

  return (
    <div className="">
      <Card className="h-[750px] w-full">
        <CardHeader>
          <CardTitle>Chat with SOMU</CardTitle>
          <CardDescription>
            A chat bot to share your problems! If you don;t want to talk to
            someone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col min-h-[600px] h-full justify-end">
            <div className="max-h-[600px] overflow-y-scroll mb-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "w-[95%] flex",
                    m.role === "user"
                      ? "items-start justify-end"
                      : "items-end justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "whitespace-pre-wrap flex sm:max-w-[400px] md:max-w-[800px] min-w-[300px] w-fit bg-secondary text-secondary-foreground my-2 p-4 rounded-xl backdrop-blur-sm"
                    )}
                  >
                    <div className="mr-4 bg-secondary my-auto">
                      {m.role === "user" ? (
                        <User width={24} height={24} />
                      ) : (
                        <Bot width={24} height={24} />
                      )}
                    </div>
                    <div className="text-pretty">{m.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex items-center justify-between"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="w-full mr-2 p-2 border rounded-md bg-secondary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-secondary rounded-md"
              >
                <Send className="text-secondary-foreground" />
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
