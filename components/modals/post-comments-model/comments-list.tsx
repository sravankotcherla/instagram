import { Comment } from "../../../services/CommentServices";
import Image from "next/image";
import { HeartIcon } from "../../../icons/heart-icon";
import { IconButton } from "@mui/material";
import { getCreatedAgo } from "../../../helpers/posts";

export interface CommentsListProps {
  comments: Comment[] | null;
}
export const CommentsList = (props: CommentsListProps) => {
  const { comments } = props;
  return (
    <div id="commentsSection" className="grow commentsList text-sm p-4">
      {comments?.length
        ? comments.map((comment) => {
            return (
              <div key={comment._id}>
                <div
                  id="commentBox"
                  className="flex flex-row justify-between gap-2 mb-4"
                >
                  <div className="shrink-0">
                    <Image
                      width={32}
                      height={32}
                      alt="Content"
                      src={comment.createdBy.profileImg || ""}
                      className="userDp"
                    />
                  </div>
                  <div className="font-semibold  ml-2 mt-1 grow">
                    <span>
                      <strong>{comment.createdBy.username} </strong>{" "}
                      {comment.text}
                    </span>
                    <div className="flex items-center gap-2 text-xs secondaryTextColor mt-2">
                      <span>{getCreatedAgo(comment.createdAt)}</span>
                      <span>{`${comment.likes} likes`}</span>
                      <span onClick={() => {}}>Reply</span>
                    </div>
                  </div>
                  <IconButton>
                    <HeartIcon width={12} height={12} />
                  </IconButton>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
