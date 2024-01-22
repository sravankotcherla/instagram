import { Modal } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreatePostActions } from "../../../redux/actions/CreatePost.actions";
import { userLoginInfo } from "../../../redux/reducers/AuthReducer";
import { clsx } from "clsx";
import { LeftArrowIcon } from "../../../icons/left-arrow-icon";
import { CrossIcon } from "../../../icons/cross-icon";
import { PostServices } from "../../../services/PostServices";

interface CreatePostModalProps {
  open: boolean;
}
export const CreatePostModal = (props: CreatePostModalProps) => {
  const { open } = props;

  const userInfo = useSelector(userLoginInfo);
  const [postImg, setPostImg] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(CreatePostActions.setPostModalOpen(false));
  };
  const handleSharePost = async () => {
    if (postImg?.length) {
      const resp = await PostServices.createPost({
        img: postImg,
        content: "",
        tags: [],
      });
      handleCloseModal();
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        dispatch(CreatePostActions.setPostModalOpen(false));
      }}
      className="flex items-center justify-center"
    >
      <div className="flex flex-col postModal ">
        <span
          className="absolute right-6 top-6 cursor-pointer"
          onClick={() => {
            handleCloseModal();
          }}
        >
          <CrossIcon width={28} height={28} customColor="white" />
        </span>
        <div className="flex items-center justify-between postModalHeading px-4">
          {postImg && (
            <LeftArrowIcon width={20} height={20} customColor="white" />
          )}
          <span>Create new post</span>
          {postImg && (
            <span className="cursor-pointer" onClick={handleSharePost}>
              Share
            </span>
          )}
        </div>
        <div
          className={clsx(
            "flex flex-row items-center justify-center postModalDescription",
            { ["w-[560px]"]: postImg === null }
          )}
        >
          {postImg ? (
            <Image src={postImg} width={560} height={560} alt="postImg" />
          ) : (
            <div className="secondaryButton">
              <label htmlFor="selectFromPc" className="cursor-pointer">
                Select from computer
              </label>
              <input
                id="selectFromPc"
                type="file"
                className="hidden"
                onChange={(event) => {
                  const img = event?.currentTarget?.files?.[0];
                  if (img) {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(img);
                    fileReader.onload = async (event) => {
                      const imgUrl = event?.target?.result?.toString() || null;
                      setPostImg(imgUrl);
                    };
                  }
                }}
              />
            </div>
          )}
          {postImg && (
            <div className="h-full flex flex-col items-center justify-start postDetails">
              <div className="captionInput w-full">
                <div className="flex items-center mb-4">
                  <Image
                    src={userInfo?.profileImg || "/assets/user.svg"}
                    alt="prfImg"
                    width={28}
                    height={28}
                    className="roundedToCircle"
                  />
                  <span className="ml-4">{userInfo?.username}</span>
                </div>
                <textarea
                  placeholder="Write a caption..."
                  className="inputTertiary"
                  value={caption}
                  onChange={(event) => {
                    setCaption(event?.currentTarget?.value || "");
                  }}
                ></textarea>
              </div>
              <div className="p-4 flex flex-col w-full">
                <span className="mb-4">Tag People</span>
                <input className="inputPrimary" placeholder="Search"></input>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
