import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { apiFetch } from "../../utils/api";

export default function VideoActions({ videoId, channelId, initialLikes }) {
  const currentUser = useSelector((state) => state.user.user);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes || 0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    apiFetch(`http://localhost:5000/like/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        const userLiked = data.some(
          (like) => like.user_id._id === currentUser._id
        );
        setLiked(userLiked);
        setLikeCount(data.length);
      })
      .catch(console.error);
  }, [videoId, currentUser._id]);

  useEffect(() => {
    apiFetch(`http://localhost:5000/subscription/` + currentUser._id)
      .then((res) => {
        if (!res.ok) throw new Error("Not subscribed");
        return res.json();
      })
      .then((sub) => {
        setSubscribed(sub.subscribedChannel.includes(channelId));
      })
      .catch(() => setSubscribed(false));
  }, [channelId, currentUser._id]);

  const toggleLike = async () => {
    try {
      if (!liked) {
        await apiFetch(`http://localhost:5000/like/${videoId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: currentUser._id }),
        });
        setLikeCount((c) => c + 1);
      } else {
        await apiFetch(`http://localhost:5000/like/unlike/${videoId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: currentUser._id }),
        });
        setLikeCount((c) => Math.max(0, c - 1));
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubscribe = async () => {
    try {
      if (!subscribed) {
        await apiFetch("http://localhost:5000/subscription/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser._id,
            subscribedChannel: [channelId],
          }),
        });
      } else {
        await apiFetch(
          `http://localhost:5000/subscription/unsubscribe/${channelId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser._id }),
          }
        );
      }
      setSubscribed(!subscribed);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-6 mt-4">
      {/* Like Button */}
      <button
        onClick={toggleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-transform duration-200 ${
          liked
            ? "bg-red-600 text-white shadow-lg hover:scale-105"
            : "bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white"
        }`}
        aria-label={liked ? "Unlike video" : "Like video"}
      >
        {liked ? (
          <FaHeart className="text-white" />
        ) : (
          <FaRegHeart className="text-gray-300" />
        )}
        <span className="font-semibold">{likeCount}</span>
      </button>

      {/* Subscribe Button */}
      <button
        onClick={toggleSubscribe}
        className={`px-5 py-2 rounded-md font-semibold transition-colors duration-300 shadow-md focus:outline-none ${
          subscribed
            ? "bg-sky-200 text-sky-800 hover:bg-sky-300"
            : "bg-sky-600 text-white hover:bg-sky-700"
        }`}
        aria-label={subscribed ? "Unsubscribe" : "Subscribe"}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}
