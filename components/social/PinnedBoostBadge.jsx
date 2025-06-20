export default function PinnedBoostBadge({ isPinned = false, isBoosted = false }) {
  if (!isPinned && !isBoosted) return null;

  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {isPinned && (
        <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
          📌 PINNED
        </span>
      )}
      {isBoosted && (
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
          🚀 BOOSTED
        </span>
      )}
    </div>
  );
}