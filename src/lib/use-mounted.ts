"use client";

import { useEffect, useState } from "react";

/** Returns true after the first client render. Avoids hydration mismatches for persisted state. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
