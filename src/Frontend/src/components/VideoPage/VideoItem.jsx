import { useNavigate } from "react-router";

export default function VideoItem({
  _id,
  title,
  user_id,
  views,
  thumbnailURL,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/videos/${_id}`)}
      className="flex cursor-pointer gap-3 p-3 rounded-md hover:bg-slate-800 transition-colors duration-200"
    >
      <div className="w-32 flex-shrink-0 aspect-video overflow-hidden rounded-md bg-gray-700">
        <img
          src={thumbnailURL}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{user_id?.channelName}</p>
        <p className="text-xs text-gray-500">{views} views</p>
      </div>
    </div>
  );
}
