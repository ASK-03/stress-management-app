"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type UserState = "Volunteer" | "Need Help";

interface UserContextType {
  userState: UserState;
  setUserState: (state: UserState) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>("Volunteer"); // Default state

  return (
    <UserContext.Provider value={{ userState, setUserState}}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
