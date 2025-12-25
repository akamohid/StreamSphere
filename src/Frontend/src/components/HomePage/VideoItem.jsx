import { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultChannelPic from "../../../public/icon-7797704_640.png";

export default function VideoItem({
  _id,
  title,
  user_id,
  views,
  isChangeable,
  onDelete,
  thumbnailURL,
  isOpenedOnChannels,
}) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleVideoPlayClick = () => navigate("/videos/" + _id);
  const handleChannelClick = () => navigate("/channels/" + user_id._id + "?tab=videos");
  const handleDeleteClick = () => onDelete(_id);
  const handleEditClick = () => navigate(`/videos/${_id}/edit`);

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div
        onClick={handleVideoPlayClick}
        className="cursor-pointer overflow-hidden rounded-xl aspect-video bg-gray-200 dark:bg-gray-800 relative"
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            Loading...
          </div>
        )}
        {hasError ? (
          <img
            src="/fallback-thumbnail.jpg"
            alt="Fallback thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={thumbnailURL}
            alt={title}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3 items-start">
        {!isOpenedOnChannels && (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden shrink-0">
            <img
              src={user_id.channelImageURL || defaultChannelPic}
              className="w-full h-full object-cover"
              alt="Channel"
            />
          </div>
        )}

        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-white line-clamp-2">{title}</h2>
          <div className="flex items-center text-sm text-blue-200 gap-3 mt-1">
            {!isOpenedOnChannels && (
              <span
                onClick={handleChannelClick}
                className="hover:underline cursor-pointer text-blue-400 font-medium"
              >
                {user_id.channelName}
              </span>
            )}
            <span className="text-sm text-blue-300">{views} views</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isChangeable && (
        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={handleDeleteClick}
            className="px-4 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
