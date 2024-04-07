import { Dialog, DialogContent } from "@mui/material";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { PostDetails } from "../../home";
import Image from "next/image";
import { PostActionsBar } from "../../posts/post-actions-bar";
import { getCreatedAgo } from "../../../helpers/posts";
import { AddCommentBar, ReplyCommentInfo } from "./add-comment-bar";
import { CrossIcon } from "../../../icons/cross-icon";
import {
  Comment,
  CommentServices,
  createCommentPayload,
} from "../../../services/CommentServices";
import { CommentsList } from "./comments-list";
import { UpdateLoader } from "../../shared/loaders/update-loader";
import clsx from "clsx";

interface PostCommentsModalProps {
  postDetails: PostDetails;
  isOpen: boolean;
  setPostDetails: Dispatch<SetStateAction<PostDetails | null>>;
}

export const PostCommentsModal = (props: PostCommentsModalProps) => {
  const { isOpen, postDetails, setPostDetails } = props;

  const [openModal, setOpenModal] = useState<boolean>(isOpen);
  const [replyInfo, setReplyInfo] = useState<ReplyCommentInfo | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const handlePostComment = (text: string) => {
    const commentPayload: createCommentPayload = {
      postId: postDetails._id,
      text: text,
      parent: replyInfo?.commentId,
    };
    CommentServices.postComment(commentPayload)
      .then((resp) => {
        console.log("Comment posted Successfully");
        setUpdating(true);
        setReplyInfo(null);
      })
      .catch((err) => {
        console.log("Failed to post comment", err);
      });
  };

  const renderComments = useMemo(() => {
    return (
      <CommentsList
        postId={postDetails._id}
        setReplyInfo={setReplyInfo}
        updating={updating}
        setUpdating={setUpdating}
      />
    );
  }, [postDetails, updating]);

  return (
    <Dialog
      open={openModal}
      onClose={() => {
        setOpenModal(false);
        setPostDetails(null);
      }}
      maxWidth="lg"
      className="postModalDialog"
    >
      {updating ? <UpdateLoader /> : null}
      <DialogContent
        className={clsx("flex flex-row postModalContent p-0 bg-black m-0")}
      >
        <div className="postModalMedia flex items-center justify-center">
          <img
            alt="Media"
            src={`/${postDetails._id}.${
              postDetails.img.split(".").slice(-1)[0]
            }`}
          />
        </div>
        <div className="flex flex-col postModalComments h-full">
          <div
            id="commentsModalHeader"
            className="flex flex-row items-center h-[60px] px-4 py-3 commentsModalHeader"
          >
            <Image
              width={32}
              height={32}
              alt="Content"
              src={postDetails.userInfo?.[0]?.profileImg}
              className="userDp"
            />
            <span className="font-semibold  ml-2">
              {postDetails.userInfo?.[0]?.username}
            </span>
          </div>
          {renderComments}
          <PostActionsBar
            liked={postDetails.isLiked?.length > 0}
            onLike={() => {}}
            onComment={() => {
              document.getElementById("commentInputBar")?.focus();
            }}
            customClass="px-2 shrink-0"
          />
          <div id="postAdditionalInfo" className="flex flex-col px-4 shrink-0">
            <span>{`${postDetails.likes} likes`}</span>
            <span className="secondaryTextColor mb-4">{`${getCreatedAgo(
              postDetails.createdAt
            )} ago`}</span>
          </div>
          <AddCommentBar
            onPostComment={handlePostComment}
            replyInfo={replyInfo}
          />
        </div>
      </DialogContent>
      <span
        onClick={() => {
          setOpenModal(false);
          setPostDetails(null);
        }}
        className="absolute right-6 top-6 cursor-pointer"
      >
        <CrossIcon width={24} height={24} customColor="white" />
      </span>
    </Dialog>
  );
};
