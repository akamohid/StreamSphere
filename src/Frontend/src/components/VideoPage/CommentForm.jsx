import useInput from "../../hooks/useInput";
import { validateTitle } from "../../utils/validation";
import Input from "../UI/Input";
import { apiFetch } from "../../utils/api";
import { useSelector } from "react-redux";
import defaultChannelPic from '../../../public/icon-7797704_640.png';

export default function CommentForm({
  channelName,
  channelImageURL,
  setComments,
  videoId,
}) {
  const [
    enteredComment,
    setEnteredComment,
    isTouched,
    setIsTouched,
    isValid,
  ] = useInput({ isValidationOn: true, validationFunc: validateTitle }, "");
  const user = useSelector(state => state.user.user);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const res = await apiFetch(`http://localhost:5000/comment/${videoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user._id, comment: enteredComment }),
    });
    if (!res.ok) throw new Error("Unable to post comment");

    const resData = await res.json();

    setComments((prev) => [...prev, resData]);
    setEnteredComment("");
    setIsTouched(false);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-start gap-4 p-4 bg-slate-800 rounded-md shadow-inner"
    >
      <img
        src={channelImageURL || defaultChannelPic}
        alt={channelName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 flex flex-col gap-2">
        <Input
          type="text"
          id="comment"
          name="comment"
          label="Add a comment"
          validation
          value={enteredComment}
          setValue={setEnteredComment}
          isTouched={isTouched}
          setIsTouched={setIsTouched}
          isValid={isValid}
          className="w-full"
          placeholder="Write your comment..."
        />
        <button
          type="submit"
          disabled={!isValid}
          className="self-end px-5 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
