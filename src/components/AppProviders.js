"use client";

import { Suspense } from "react";
import { StoreProvider } from "@/lib/store";
import AppShell from "@/components/AppShell";

export default function AppProviders({ children }) {
  return (
    <StoreProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 p-6 text-sm text-slate-500">
            Loading…
          </div>
        }
      >
        <AppShell>
          <main className="mt-16 ml-10">{children}</main>
        </AppShell>
      </Suspense>
    </StoreProvider>
  );
}
