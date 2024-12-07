"use client";
import { useUserContext } from "@/providers/user-type-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { ArrowDown } from "lucide-react";


const UserStateDropdown = () => {

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
            onClick={() => setUserState(state as "Volunteer" | "Need Help")}
          >
            {state}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserStateDropdown;
