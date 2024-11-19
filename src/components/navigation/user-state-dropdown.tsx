"use client";
import { useUserContext } from "@/providers/user-type-provider";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { ArrowBigDown, ArrowDown } from "lucide-react";

type Props = {};

const UserStateDropdown = (props: Props) => {
  const user = useUser();
  const { userState, setUserState } = useUserContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[140px] p-2 border rounded-md flex items-center justify-between">
        {userState} <ArrowDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {["Volunteer", "Need Help"].map((state) => (
          <DropdownMenuItem
            key={state}
            onClick={() => setUserState(state as any)}
          >
            {state}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserStateDropdown;
