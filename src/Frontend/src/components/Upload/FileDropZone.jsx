import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

export default function FileDropZone({ setFiles, files }) {
  const [imageURL, setImageURL] = useState(files.image);
  const [videoURL, setVideoURL] = useState(files.video);

  const onDrop = useCallback((acceptedFiles) => {
    let image = null;
    let video = null;

    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/') && !image) {
        image = file;
        const reader = new FileReader();
        reader.onload = () => setImageURL(reader.result);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/') && !video) {
        video = file;
        const reader = new FileReader();
        reader.onload = () => setVideoURL(reader.result);
        reader.readAsDataURL(file);
      }
    });

    setFiles({ image, video });
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <motion.div
      {...getRootProps()}
      className={`transition-all duration-300 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
      ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-blue-300 bg-white/70 backdrop-blur-md'}`}
      whileHover={{ scale: 1.02 }}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {(imageURL || videoURL) && (
          <div className="flex gap-4 flex-wrap justify-center">
            {imageURL && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-40 h-40 overflow-hidden rounded-xl shadow-md border"
              >
                <img src={imageURL} alt="Uploaded" className="w-full h-full object-cover" />
              </motion.div>
            )}
            {videoURL && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-40 h-40 overflow-hidden rounded-xl shadow-md border"
              >
                <video src={videoURL} controls className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        )}

        <p className="text-gray-600 font-medium">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop or click to select a thumbnail and video file"}
        </p>
      </div>
    </motion.div>
  );
}
