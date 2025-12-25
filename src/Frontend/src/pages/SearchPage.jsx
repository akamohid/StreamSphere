import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import VideosList from "../components/HomePage/VideosList";
import { apiFetch } from "../utils/api";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search).get("query");
}

export default function SearchPage() {
  const query = useQuery();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) return;

      setLoading(true);
      try {
        const res = await apiFetch("http://localhost:5000/video/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) throw new Error("Failed to fetch search results");

        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error(error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen w-full bg-transparent py-8 px-4 sm:px-10">
      <h1 className="text-2xl font-bold mb-6">Search results for "{query}"</h1>
      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <VideosList videos={videos} />
      )}
    </div>
  );
}
