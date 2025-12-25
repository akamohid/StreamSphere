import { useRouteLoaderData } from "react-router";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
import VideoActions from "../components/VideoPage/VideoActions";
import CommentsList from "../components/VideoPage/CommentsList";
import VideosList from "../components/VideoPage/VideosList";
import { apiFetch } from "../utils/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import defaultPic from '../../public/icon-7797704_640.png'

export default function VideoPage() {
  const { destinationVideo, videos, comments } = useRouteLoaderData("video");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const updateViewsAndHistory = async () => {
      try {
        const response = await apiFetch(
          "http://localhost:5000/video/viewandhistroy/" + destinationVideo._id,
          {
            method: "POST",
            body: JSON.stringify({
              user_id: user._id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Cannot update views and history");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (destinationVideo && user?._id) {
      updateViewsAndHistory();
    }
  }, [destinationVideo, user?._id]);

  return (
    <div className="min-h-screen bg-transparent px-4 sm:px-6 lg:px-10 py-8 text-white animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Video + Comments */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <VideoPlayer videoData={destinationVideo} />

          {/* Channel + Video Info Section */}
          <div className="flex flex-col sm:flex-row gap-2 px-2 py-4 bg-slate-800 rounded-xl shadow-md">
            {/* Left: Channel Info */}
            <div className="flex flex-col items-center gap-2 w-full sm:w-[200px]">
              <img
                src={destinationVideo.user_id.channelImageURL || defaultPic}
                alt="Channel"
                className="w-16 h-16 rounded-full object-cover border-2 border-sky-500 shadow"
              />
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  {destinationVideo.user_id.channelName}
                </h3>
                <p className="text-xs text-gray-400">
                  {destinationVideo.user_id.subscribers || 0} subs
                </p>
              </div>
            </div>

            {/* Right: Video Info */}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-2">
                {destinationVideo.title}
              </h2>
              <p className="text-sm text-gray-200 whitespace-pre-line mb-2">
                {destinationVideo.description}
              </p>
              <p className="text-xs text-gray-400">
                Published on{" "}
                {new Date(destinationVideo.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          <VideoActions
            videoId={destinationVideo._id}
            channelId={destinationVideo.user_id._id}
            initialLikes={destinationVideo.likes}
          />
          <CommentsList
            comments={comments}
            channelName={destinationVideo.user_id.channelName}
            channelImageURL={destinationVideo.user_id.channelImageURL}
            videoId={destinationVideo._id}
          />
        </div>

        {/* Up Next */}
        <aside className="flex h-max flex-col gap-4 p-4 bg-slate-900 rounded-xl shadow-lg animate-slideUp">
          <h2 className="text-xl font-semibold text-sky-300">Up Next</h2>
          <div className="flex-1 overflow-y-auto space-y-4">
            <VideosList videos={videos} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const response = await apiFetch("http://localhost:5000/video/get-all");

  if (!response.ok) throw new Error("Error fetching the video data");

  const responseData = await response.json();
  let destinationVideo = null;

  const videos = responseData.filter((video) => {
    if (video._id === params.videoId) destinationVideo = video;
    return video._id !== params.videoId;
  });

  if (!destinationVideo) {
    throw new Error("Cant find the requried Video");
  }

  const comments = await apiFetch(
    "http://localhost:5000/comment/" + params.videoId
  );

  if (!comments.ok) {
    throw new Error("Cant fetch the comments");
  }

  const commentsData = await comments.json();

  return { destinationVideo, videos, comments: commentsData };
}
