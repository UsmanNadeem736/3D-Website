import { Suspense } from "react";
import type { Metadata } from "next";
import { SuccessContent } from "./SuccessContent";

export const metadata: Metadata = { title: "Order confirmed" };

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
