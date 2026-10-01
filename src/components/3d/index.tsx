"use client";

import dynamic from "next/dynamic";

/**
 * Client-only wrappers for every Canvas. WebGL can't render on the server,
 * so each scene is loaded with `ssr: false` and shows a light placeholder.
 */
const Placeholder = ({ className = "" }: { className?: string }) => (
  <div className={`flex h-full w-full items-center justify-center ${className}`}>
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
  </div>
);

export const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => <Placeholder /> });
export const Product3DViewer = dynamic(() => import("./Product3DViewer"), {
  ssr: false,
  loading: () => <Placeholder className="h-[420px] rounded-3xl bg-violet-50 sm:h-[540px]" />,
});
export const MiniPreview = dynamic(() => import("./MiniPreview"), { ssr: false, loading: () => <Placeholder /> });
export const VirtualStore = dynamic(() => import("./VirtualStore"), { ssr: false, loading: () => <Placeholder /> });
