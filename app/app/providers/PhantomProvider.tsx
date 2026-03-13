"use client";

import { ReactNode } from "react";
import { PhantomProvider } from "@phantom/react-sdk";
import { AddressType } from "@phantom/browser-sdk";

export default function ShukaPhantomProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PhantomProvider
      config={{
        appId: "ba8bef06-7eef-4f29-bc09-e0d6313240df",
        providers: ["injected"],
        addressTypes: [AddressType.solana],
      }}
      appName="Shuka"
    >
      {children}
    </PhantomProvider>
  );
}
