// src/context/MockUserContext.tsx
import React, { createContext, useContext } from "react";

type User = {
  name: string;
  email: string;
  role: string;
  org: string;
};

const MockUserContext = createContext<User | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  return useContext(MockUserContext);
};

export const MockUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockUser: User = {
    name: "Alex Developer",
    email: "alex@company.com",
    role: "Analyst",
    org: "Acme Corp",
  };

  return <MockUserContext.Provider value={mockUser}>{children}</MockUserContext.Provider>;
};
