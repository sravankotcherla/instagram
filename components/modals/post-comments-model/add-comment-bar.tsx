import { useState } from "react";

interface AddCommentInterface {
  onPostComment: (commentText: string) => void;
}
export const AddCommentBar = (props: AddCommentInterface) => {
  const { onPostComment } = props;

  const [commentText, setCommentText] = useState<string>("");

  return (
    <div className="flex flex-row items-center addCommentBar">
      <textarea
        id="commentInputBar"
        className="inputTertiary commentsInput flex flex-row items-center"
        placeholder="Add a Comment..."
        value={commentText}
        onChange={(event) => {
          setCommentText(event.currentTarget.value);
        }}
      />
      <span
        onClick={() => {
          debugger;
          onPostComment(commentText);
        }}
        className={`ml-2 ${
          commentText?.length ? "cursor-pointer" : "disabledText cursor-default"
        }`}
      >
        Post
      </span>
    </div>
  );
};
