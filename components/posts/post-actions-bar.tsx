import { IconButton } from "@mui/material";
import { CommentIcon } from "../../icons/comment-icon";
import { HeartIcon } from "../../icons/heart-icon";

import { SaveIcon } from "../../icons/save-icon";
import { ShareIcon } from "../../icons/share-icon";
import { SolidHeartIcon } from "../../icons/solid-heart-icon";

interface PostActionsBarInterface {
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  customClass?: string;
}
export const PostActionsBar = (props: PostActionsBarInterface) => {
  const { liked, onLike, onComment, customClass = "" } = props;
  return (
    <div
      id="postActions"
      className={`flex justify-between items-center postActionsBar ${customClass}`}
    >
      <div className="flex items-center">
        <IconButton onClick={onLike}>
          {liked ? <SolidHeartIcon /> : <HeartIcon />}
        </IconButton>
        <IconButton onClick={onComment}>
          <CommentIcon />
        </IconButton>
        <IconButton>
          <ShareIcon />
        </IconButton>
      </div>
      <IconButton>
        <SaveIcon />
      </IconButton>
    </div>
  );
};
