import { useEffect, useState } from "react";
import VideoItem from "./VideoItem";
import { apiFetch } from "../../utils/api";

export default function VideosList({ videos, isChangeable = false, isOpenedOnChannels = false, handleDelete }) {
  const [stateVideos, setStateVideos] = useState([]);

  useEffect(() => {
    setStateVideos(videos);
  }, [videos])

  const handleVideoDelete = async (id) => {
    const response = await apiFetch(`http://localhost:5000/video/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Can't delete the video");
    setStateVideos(stateVideos.filter((video) => video._id !== id));
  };

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {stateVideos.map((video) => (
      <VideoItem
        key={video._id}
        isChangeable={isChangeable}
        onDelete={handleDelete || handleVideoDelete}
        isOpenedOnChannels={isOpenedOnChannels}
        {...video}
      />
    ))}
  </div>
);
}
