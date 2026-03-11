"use client";

import { UserProvider } from "@/app/providers/UserProvider";
import { TripProvider } from "@/app/providers/TripProvider";

export default function Providers({ children }) {
  return (
    <UserProvider>
      <TripProvider>{children}</TripProvider>
    </UserProvider>
  );
}
