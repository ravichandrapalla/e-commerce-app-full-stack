export default function SkeletonCard() {
  return (
    <div className="animate-pulse border rounded-xl p-4">
      <div className="bg-gray-300 h-40 rounded"></div>
      <div className="mt-2 h-4 bg-gray-300 w-3/4"></div>
      <div className="mt-1 h-4 bg-gray-200 w-1/2"></div>
    </div>
  );
}
