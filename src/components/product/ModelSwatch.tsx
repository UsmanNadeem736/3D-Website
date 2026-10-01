import type { ProductModel } from "@/types";

const icons: Record<ProductModel["kind"], string> = {
  ball: "🎾",
  bone: "🦴",
  bag: "🥫",
  bowl: "🥣",
  bed: "🛏️",
  collar: "📿",
  mouse: "🐭",
  tower: "🏰",
  bottle: "🧴",
  carrier: "🧳",
  fishbowl: "🐠",
  hutch: "🏡",
};

/** Cheap, non-WebGL thumbnail used where a full canvas would be overkill (cart lines, etc.). */
export function ModelSwatch({ model, className = "" }: { model: ProductModel; className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-xl text-3xl ${className}`}
      style={{ background: `radial-gradient(circle at 30% 25%, ${model.accent}, ${model.color})` }}
      aria-hidden
    >
      <span className="drop-shadow">{icons[model.kind]}</span>
    </div>
  );
}
