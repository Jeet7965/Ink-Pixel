const SkeletonImageDetails = () => {
  return (
    <div className="w-full min-h-screen bg-black animate-pulse">

      {/* TOP BAR */}
      <div className="h-16 w-full bg-black/40"></div>

      {/* IMAGE Skeleton */}
      <div className="flex justify-center items-center h-[70vh]">
        <div className="bg-gray-800 rounded-xl w-11/12 h-full"></div>
      </div>

      {/* BOTTOM INFO */}
      <div className="fixed bottom-0 left-0 w-full bg-black/70 p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-3 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonImageDetails;
