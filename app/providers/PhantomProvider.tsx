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
        appId: "ba8bef06-7eef-4f29-bc09-e0d6313240df",
      }}
    >
      {children}
    </PhantomProvider>
  );
}
