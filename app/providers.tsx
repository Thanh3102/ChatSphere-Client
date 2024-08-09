"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./libs/redux/StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
