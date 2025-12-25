import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import VideosList from "../components/HomePage/VideosList";
import SkeletonVideosList from '../components/UI/Skeleton/VideosList';
import { apiFetch } from "../utils/api";

export default function HomePage() {
  const { videos } = useLoaderData();

  return (
    <div className="max-w-full mx-auto">
      <h1 className="text-center text-4xl font-bold text-blue-200 mb-10">
        Discover the Latest in <span className="text-blue-400">Streaming</span>
      </h1>
      <Suspense fallback={<SkeletonVideosList />}>
        <Await
          resolve={videos}
          children={(loadedVideos) => (
            <VideosList videos={loadedVideos} />
          )}
        />
      </Suspense>
    </div>
  );
}

export async function loadVideos() {
  const response = await apiFetch("http://localhost:5000/video/get-all");
  if (!response.ok) throw new Error("Unable to fetch videos");
  const responseData = await response.json();
  return responseData;
}

export async function loader() {
  return defer({
    videos: loadVideos(),
  });
}
