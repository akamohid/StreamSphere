import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  FaCog,
  FaPause,
  FaPlay,
  FaForward,
  FaBackward,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import screenfull from "screenfull";

// format seconds to mm:ss or hh:mm:ss
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .map((t, i) => (i === 0 && h === 0 ? null : String(t).padStart(2, "0")))
    .filter(Boolean)
    .join(":");
}

export default function VideoPlayer({ videoData }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const progressRef = useRef(null);

  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!videoData) return;
    if (hlsRef.current) hlsRef.current.destroy();
    setIsLoading(true);

    // HLS setup
    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr, url) => xhr.open("GET", url, true),
      });
      hlsRef.current = hls;
      const source = videoData.masterPlaylist
        ? URL.createObjectURL(
            new Blob([videoData.masterPlaylist], {
              type: "application/vnd.apple.mpegurl",
            })
          )
        : videoData.hlsBaseUrl || videoData.URL;
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
        setCurrentLevel(hls.currentLevel);
        setIsLoading(false);
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      });
      hls.on(
        Hls.Events.ERROR,
        (_, data) => data.fatal && setError(`HLS error: ${data.type}`)
      );
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) =>
        setCurrentLevel(data.level)
      );
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoData.hlsBaseUrl || videoData.URL;
      video.onloadedmetadata = () => setIsLoading(false);
    } else {
      setError("HLS not supported");
    }

    // time updates
    const onLoaded = () => setDuration(video.duration);
    const onTime = () => setCurrentTime(video.currentTime);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
    };
  }, [videoData]);

  // controls
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const seekBy = (sec) =>
    videoRef.current && (videoRef.current.currentTime += sec);
  const selectTime = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
  };
  const onProgressHover = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(pct * duration);
    setHoverX(e.clientX - rect.left);
  };
  const leaveHover = () => setHoverTime(null);

  const handleQualityChange = (level) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentLevel(level);
      setShowQualityMenu(false);
    }
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  useEffect(() => {
    if (!screenfull.isEnabled) return;
    function handleChange() {
      setIsFullscreen(screenfull.isFullscreen);
    }
    screenfull.on("change", handleChange);
    return () => screenfull.off("change", handleChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative group bg-black rounded-lg overflow-hidden"
    >
      <video
        ref={videoRef}
        controls={false}
        className="w-full h-full object-contain bg-black"
        style={{ aspectRatio: "16/9" }}
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 border-4 border-t-4 border-white border-opacity-75 rounded-full animate-spin"></div>
        </div>
      )}
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 p-4 text-red-500 bg-black bg-opacity-50">
          {error}
        </div>
      )}

      {/* Center Controls */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => seekBy(-10)}
          className="p-2 mx-4 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
        >
          <FaBackward size={20} />
        </button>
        <button
          onClick={togglePlay}
          className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
        >
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
        <button
          onClick={() => seekBy(10)}
          className="p-2 mx-4 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
        >
          <FaForward size={20} />
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="absolute left-0 right-0 bottom-0 h-10 flex items-center px-3 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          ref={progressRef}
          onClick={selectTime}
          onMouseMove={onProgressHover}
          onMouseLeave={leaveHover}
          className="relative flex-1 h-1 bg-gray-600 rounded cursor-pointer"
        >
          <div
            className="absolute top-0 left-0 h-1 bg-red-600"
            style={{ width: `${progressPct}%` }}
          />
          {hoverTime !== null && (
            <div
              style={{ left: hoverX }}
              className="absolute -top-6 px-1 text-xs bg-black text-white rounded"
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>
        <div className="ml-4 text-sm text-white select-none">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="ml-4 relative">
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="p-1 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-75"
          >
            <FaCog size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="ml-4 p-1 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-75"
          >
            {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
          </button>
          {showQualityMenu && (
            <div className="absolute bottom-8 right-0 bg-black bg-opacity-75 text-white rounded shadow-lg">
              <button
                onClick={() => handleQualityChange(-1)}
                className="block px-3 py-1 w-full text-left hover:bg-gray-700"
              >
                Auto
              </button>
              {levels.map((lvl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQualityChange(idx)}
                  className="block px-3 py-1 w-full text-left hover:bg-gray-700"
                >
                  {lvl.height}p
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
