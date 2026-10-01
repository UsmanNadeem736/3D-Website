export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-amber-400" aria-label={`${value} out of 5 stars`}>
        {"★★★★★".slice(0, Math.round(value))}
        <span className="text-gray-200">{"★★★★★".slice(Math.round(value))}</span>
      </span>
      <span className="font-medium text-gray-700">{value.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-gray-400">({reviews.toLocaleString("en-GB")})</span>}
    </div>
  );
}
