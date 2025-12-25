// --- Updated ChannelPage.jsx ---
import { Suspense, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Await,
  defer,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router";
import VideosList from "../components/HomePage/VideosList";
import { apiFetch } from "../utils/api";
import defaultChannelPic from "../../public/icon-7797704_640.png";

export default function ChannelPage() {
  const loaderData = useLoaderData();
  const { channelId } = useParams();
  const currUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tab || "videos");

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (activeTab === "playlists") {
      loadPlaylists();
    }
  }, [activeTab]);

  async function loadPlaylists() {
    const res = await apiFetch(`http://localhost:5000/playlist/${channelId}`);
    if (res.ok) {
      const data = await res.json();
      setPlaylists(data);
    }
  }

  async function createPlaylist(e) {
    e.preventDefault();
    if (!newPlaylistName) return;
    await apiFetch("http://localhost:5000/playlist/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: channelId,
        name: newPlaylistName,
        video_id: [],
      }),
    });
    setNewPlaylistName("");
    setIsPlaylistModalOpen(false);
    loadPlaylists();
  }

  function handleUploadClick() {
    navigate("/upload");
  }

  function openImageModal() {
    if (currUser._id !== channelId) return;
    setIsImageModalOpen(true);
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
    setSelectedFile(null);
  }

  async function handleImageSubmit(e) {
    e.preventDefault();
    if (!selectedFile) return;
    const form = new FormData();
    form.append("image", selectedFile);
    await apiFetch(`http://localhost:5000/user/uploadimage/${channelId}`, {
      method: "PUT",
      body: form,
    });
    closeImageModal();
    window.location.reload();
  }

  return (
    <div className="min-h-screen w-full bg-transparent py-8 px-4 sm:px-10">
      <Suspense
        fallback={<div className="text-center">Loading channel info...</div>}
      >
        <Await resolve={loaderData.channelInfo}>
          {(channelInfo) => (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-transparent rounded-xl shadow p-6 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={channelInfo.channelImageURL || defaultChannelPic}
                  onClick={openImageModal}
                  alt={channelInfo.channelName}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-600 ${
                    currUser._id === channelId
                      ? "cursor-pointer hover:opacity-80"
                      : ""
                  }`}
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {channelInfo.channelName}
                  </h1>
                  <div className="text-sm text-white mt-1">
                    <Suspense fallback={<span>–</span>}>
                      <Await resolve={loaderData.subCount}>
                        {(subCount) => <span>{subCount} subscribers</span>}
                      </Await>
                    </Suspense>
                    <span className="mx-2">|</span>
                    <Suspense fallback={<span>–</span>}>
                      <Await resolve={loaderData.totalLikes}>
                        {(totalLikes) => <span>{totalLikes} likes</span>}
                      </Await>
                    </Suspense>
                  </div>
                </div>
              </div>
              {channelId === currUser._id && (
                <button
                  onClick={handleUploadClick}
                  className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                  Upload Video
                </button>
              )}
            </div>
          )}
        </Await>
      </Suspense>

      <div className="flex gap-4 mb-6">
        {[
          "videos",
          "playlists",
          ...(channelId === currUser._id ? ["history"] : []),
        ].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setSearchParams({ tab: tabName })}
            className={`relative px-4 py-2 text-sm font-medium transition ${
              activeTab === tabName
                ? "text-blue-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "videos" && (
        <Suspense fallback={<div>Loading videos...</div>}>
          <Await resolve={loaderData.videos}>
            {(loaded) => (
              <VideosList
                isChangeable={channelId === currUser._id}
                isOpenedOnChannels={true}
                videos={loaded.video}
              />
            )}
          </Await>
        </Suspense>
      )}

      {activeTab === "history" && (
        <Suspense fallback={<div>Loading watch history...</div>}>
          <Await resolve={loaderData.watchHistory}>
            {(data) => {
              const [watchedVideos, setWatchedVideos] = useState(
                data.watchedVideos
              );

              async function handleWatchDelete(id) {
                const response = await apiFetch(
                  "http://localhost:5000/histroy/remove/" + id,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      user_id: currUser._id,
                    }),
                  }
                );

                if (!response.ok) {
                  throw new Error("Unable to delete watch history video");
                }

                setWatchedVideos((videos) =>
                  videos.filter((video) => video._id !== id)
                );
              }

              return watchedVideos.length === 0 ? (
                <p className="text-white">No watch history found.</p>
              ) : (
                <VideosList
                  videos={watchedVideos}
                  isOpenedOnChannels={true}
                  isChangeable={true}
                  handleDelete={handleWatchDelete}
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      {activeTab === "playlists" && (
        <div>
          {channelId === currUser._id && (
            <button
              onClick={() => setIsPlaylistModalOpen(true)}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Playlist
            </button>
          )}
          {playlists.length === 0 ? (
            <p className="text-gray-500">No playlists yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {playlists.map((pl) => (
                <div
                  key={pl._id}
                  className="bg-transparent p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-200"
                  onClick={() => navigate(`/playlists/${pl._id}`)}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {pl.name}
                  </h3>
                  <p className="text-sm text-white">
                    {pl.video_id.length} videos
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={closeImageModal}
            className="fixed inset-0 bg-black opacity-50"
          />
          <form
            onSubmit={handleImageSubmit}
            className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl relative z-10"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Change Channel Image
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-4 block w-full text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeImageModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!selectedFile}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlist Creation Modal */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setIsPlaylistModalOpen(false)}
            className="fixed inset-0 bg-black opacity-50"
          />
          <form
            onSubmit={createPlaylist}
            className="bg-slate-900 p-6 rounded-lg shadow-lg z-10 w-full max-w-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Create Playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="mb-4 w-full p-2 border rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPlaylistModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

async function loadChannelVideos(channelId) {
  const response = await apiFetch("http://localhost:5000/video/get", {
    method: "POST",
    body: JSON.stringify({ user_id: channelId }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Could not fetch the videos");
  return response.json();
}
async function loadChannelInfo(channelId) {
  const response = await apiFetch(
    "http://localhost:5000/user/getuser/" + channelId
  );
  if (!response.ok) throw new Error("Could not fetch user data");
  return response.json();
}
async function loadSubscriberCount(channelId) {
  const res = await apiFetch(
    `http://localhost:5000/subscription/count/${channelId}`
  );
  if (!res.ok) return 0;
  const { count } = await res.json();
  return count;
}
async function loadTotalLikes(channelId) {
  const vidData = await loadChannelVideos(channelId);
  return vidData.video.reduce((sum, vid) => sum + (vid.likes || 0), 0);
}

async function loadWatchHistory(channelId) {
  const response = await apiFetch("http://localhost:5000/histroy/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: channelId }),
  });
  if (!response.ok) return { watchedVideos: [] };
  return response.json();
}

export async function loader({ params }) {
  const channelId = params.channelId;
  return defer({
    videos: loadChannelVideos(channelId),
    channelInfo: loadChannelInfo(channelId),
    subCount: loadSubscriberCount(channelId),
    totalLikes: loadTotalLikes(channelId),
    watchHistory: loadWatchHistory(channelId),
  });
}
