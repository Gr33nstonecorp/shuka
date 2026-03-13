"use client";

import { ReactNode } from "react";
import { PhantomProvider } from "@phantom/react-sdk";

export default function ShukaPhantomProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PhantomProvider
      config={{
        appId: "YOUR_PHANTOM_APP_ID",
      }}
    >
      {children}
    </PhantomProvider>
  );
}
