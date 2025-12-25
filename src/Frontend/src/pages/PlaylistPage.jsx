import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { apiFetch } from "../utils/api";
import VideosList from "../components/HomePage/VideosList";

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const currUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await apiFetch(
          `http://localhost:5000/playlist/video/${playlistId}`
        );
        if (!res.ok) throw new Error("Failed to fetch playlist");
        const data = await res.json();
        setPlaylist(data.playlist);
        setVideos(data.videos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, [playlistId]);

  async function deletePlaylist() {
    const confirm = window.confirm(
      "Are you sure you want to delete this playlist?"
    );
    if (!confirm) return;
    await apiFetch(`http://localhost:5000/playlist/delete/${playlistId}`, {
      method: "DELETE",
    });
    navigate(`/channels/${currUser._id}`);
  }

  function handleAddVideo() {
    navigate(`/upload?playlistId=${playlistId}`);
  }

  if (loading)
    return <div className="p-8 text-center">Loading playlist...</div>;
  if (!playlist)
    return (
      <div className="p-8 text-center text-red-500">Playlist not found</div>
    );

  return (
    <div className="min-h-screen w-full bg-transparent py-10 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {playlist.name}
            </h1>
            <p className="text-white text-sm">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </p>
          </div>

          {currUser._id === playlist.user_id && (
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleAddVideo}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Add Video
              </button>
              <button
                onClick={deletePlaylist}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Delete Playlist
              </button>
            </div>
          )}
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-500 text-lg">
              This playlist is currently empty.
            </p>
          </div>
        ) : (
          <VideosList
            videos={videos}
            isOpenedOnChannels={true}
            isChangeable={currUser._id === playlist.user_id}
          />
        )}
      </div>
    </div>
  );
}
