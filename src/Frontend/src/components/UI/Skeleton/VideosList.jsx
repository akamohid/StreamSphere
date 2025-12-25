import VideoItem from "./VideoItem";

export default function VideosList() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pl-4 pr-6 py-6">
        {Array.from({ length: 9 }).map((_, id) => (
          <VideoItem key={id} />
        ))}
      </div>
    );
  }
  