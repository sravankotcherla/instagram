import { useEffect, useState } from "react";

interface AddCommentInterface {
  onPostComment: (commentText: string) => void;
  replyInfo?: ReplyCommentInfo | null;
}

export interface ReplyCommentInfo {
  commentId: string;
  text: string;
}
export const AddCommentBar = (props: AddCommentInterface) => {
  const { onPostComment, replyInfo } = props;

  const [commentText, setCommentText] = useState<string>("");

  useEffect(() => {
    setCommentText(replyInfo?.text || "");
  }, [replyInfo]);

  return (
    <div className="flex flex-row items-center addCommentBar shrink-0">
      <textarea
        id="commentInputBar"
        className="inputTertiary commentsInput flex flex-row items-center"
        placeholder="Add a Comment..."
        value={commentText}
        onChange={(event) => {
          setCommentText(event.currentTarget.value);
        }}
        autoFocus={replyInfo?.text?.length ? true : false}
      />
      <span
        onClick={() => {
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
