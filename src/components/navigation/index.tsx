import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../global/mode-toggle";
import UserStateDropdown from "./user-state-dropdown";

type Props = {
  isHero: boolean;
  userId?: string;
};

const Navigation = async ({ isHero, userId }: Props) => {
  return (
    <>
      <div className="h-[4.5rem]"></div>
      <div
        className={cn(
          "fixed top-0 right-0 left-0 p-4 flex items-center bg-secondary-background shadow-sm shadow-primary/5 backdrop-blur-md justify-between z-10 transition-all"
        )}
      >
        <aside className={cn("flex items-center gap-2")}>
          <span className="text-xl font-bold">SOMU</span>
        </aside>

        <aside className="flex gap-2 items-center">
          {!isHero && <UserStateDropdown />}
          {isHero && (
            <Link href="/verify-user">
              <Button className="px-4 py-2 rounded-full bg-secondary-foreground text-secondary text-sm font-semibold">
                Dashboard
              </Button>
            </Link>
          )}
          {!isHero && (
            <Link href="/">
              <Button className="px-4 py-2 rounded-full bg-secondary-foreground hover: text-secondary text-sm font-semibold">
                Back to Landing Page
              </Button>
            </Link>
          )}
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 rounded-full bg-secondary-foreground text-secondary text-sm font-semibold">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <UserButton />
          <ModeToggle />
        </aside>
      </div>
    </>
  );
};

export default Navigation;
