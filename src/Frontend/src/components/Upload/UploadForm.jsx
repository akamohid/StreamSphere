import {
  Form,
  useNavigation,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import useInput from "../../hooks/useInput";
import { validateTitle } from "../../utils/validation";
import Input from "../UI/Input";
import FileDropZone from "./FileDropZone";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FormLoader from "./FormLoader";

export default function UploadForm({ title, thumbnail, video }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const isEditing = !!params.videoId;
  const [files, setFiles] = useState({ image: null, video: null });
  const navigation = useNavigation();
  const [description, setDescription] = useState(
    isEditing ? video?.description || "" : ""
  );

  const hiddenImageInput = useRef();
  const hiddenVideoInput = useRef();

  useEffect(() => {
    if (files.image && hiddenImageInput.current) {
      const dt = new DataTransfer();
      dt.items.add(files.image);
      hiddenImageInput.current.files = dt.files;
    }
    if (files.video && hiddenVideoInput.current) {
      const dt = new DataTransfer();
      dt.items.add(files.video);
      hiddenVideoInput.current.files = dt.files;
    }
  }, [files]);

  const [
    enteredTitle,
    setEnteredTitle,
    isTitleTouched,
    setIsTitleTouched,
    isTitleValid,
  ] = useInput(
    { isValidationOn: true, validationFunc: validateTitle },
    isEditing ? title : ""
  );

  let postURL = "/upload";
  if (searchParams.get("playlistId")) {
    postURL += `?playlistId=${searchParams.get("playlistId")}`;
  } else if (isEditing) {
    postURL = `/videos/${params.videoId}/edit`;
  }

  function handleSubmission(e) {
    e.preventDefault();
    const form = e.target.closest("form");
    submit(new FormData(form), {
      method: "POST",
      action: postURL,
      encType: "multipart/form-data",
    });
  }

  return (
    <>
      {navigation.state === "submitting" && <FormLoader />}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-12"
      >
        <Form
          method="POST"
          className="bg-slate-900 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border-2 border-blue-100"
          encType="multipart/form-data"
        >
          <h1 className="text-3xl font-extrabold text-center text-blue-600 tracking-tight">
            {isEditing ? "Edit Your Video" : "Upload a New Creation"}
          </h1>

          <div className="space-y-6">
            <Input
              type="text"
              label="Title"
              id="title"
              name="title"
              validation={true}
              isTouched={isTitleTouched}
              setIsTouched={setIsTitleTouched}
              value={enteredTitle}
              setValue={setEnteredTitle}
              isValid={isTitleValid}
            />

            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-2 font-medium text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                className="p-4 rounded-lg bg-zinc-800 text-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a compelling description of your video..."
              />
            </div>
          </div>

          <FileDropZone setFiles={setFiles} files={files} />

          <input type="file" name="thumbnail" ref={hiddenImageInput} hidden />
          <input type="file" name="video" ref={hiddenVideoInput} hidden />

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmission}
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full py-2 px-8 shadow-md hover:shadow-lg transition-all"
            >
              {isEditing ? "Update Video" : "Upload Video"}
            </motion.button>
          </div>
        </Form>
      </motion.div>
    </>
  );
}
