export default function VideoItem() {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="bg-gray-300 rounded-lg w-full aspect-video"></div>
  
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
  
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  