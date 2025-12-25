import { useRouteLoaderData } from "react-router";
import UploadForm from "../components/Upload/UploadForm";
import store from "../store";
import { apiFetch } from "../utils/api";

export default function VideoFormPage() {
  const data = useRouteLoaderData("video");
  let returnedElement = <UploadForm />;

  if (data) {
    returnedElement = <UploadForm {...data.destinationVideo} />;
  }

  return returnedElement;
}

export async function action({ request, params }) {
  const user = store.getState().user.user;
  const isEditing = !!params.videoId;
  const originalFormData = await request.formData();
  const urlSearchparams = new URL(request.url).searchParams;

  const formData = new FormData();

  const videoFile = originalFormData.get("video");
  const thumbnailFile = originalFormData.get("thumbnail");
  const title = originalFormData.get("title");
  const description = originalFormData.get('description');

  formData.append("video", videoFile);
  formData.append("thumbnail", thumbnailFile);
  formData.append("data", JSON.stringify({ title, user_id: user._id, description }));

  const isPlaylistAdding = !!urlSearchparams.get('playlistId');

  let url = isEditing
    ? `http://localhost:5000/video/update/${params.videoId}`
    : "http://localhost:5000/video/add";

  const response = await apiFetch(url, {
    method: "POST",
    body: formData, 
  });

  if(!response.ok)
    throw new Error('Error uploading Video');

  const resData = await response.json();

  if(isPlaylistAdding) {
    const response2 = await apiFetch('http://localhost:5000/playlist/add/' + urlSearchparams.get('playlistId'), {
      method: 'PUT',
      body: JSON.stringify({
        video_id: resData._id, 
      }),
      headers: {
          'Content-Type': 'application/json'
        }
    });

    if(!response2.ok)
      throw new Error('Error adding video to playlist');
  }

  return resData;
}
