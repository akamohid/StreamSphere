import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentsList({
  comments: initialComments,
  channelName,
  channelImageURL,
  videoId,
}) {
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    setAllComments(initialComments);
  }, [initialComments]);

  return (
    <section className="flex flex-col gap-6 bg-slate-900 rounded-xl shadow-md p-6 max-w-4xl w-full mx-auto animate-fadeIn">
      <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-3">
        Comments
      </h2>
      <CommentForm
        channelName={channelName}
        channelImageURL={channelImageURL}
        setComments={setAllComments}
        videoId={videoId}
      />
      <div className="space-y-4 pr-1">
        {allComments.map((c) => (
          <CommentItem key={c._id} {...c} />
        ))}
      </div>
    </section>
  );
}
