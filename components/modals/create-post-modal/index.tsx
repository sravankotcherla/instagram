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
import { MediaCarousel } from "../../media/carousel";
import { UpdateLoader } from "../../shared/loaders/update-loader";

interface CreatePostModalProps {
  open: boolean;
}
export const CreatePostModal = (props: CreatePostModalProps) => {
  const { open } = props;

  const userInfo = useSelector(userLoginInfo);
  const [uploadedMedia, setUploadedMedia] = useState<
    | {
        url: string;
        type: string;
      }[]
    | null
  >(null);
  const [imgFiles, setImgFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setUploadedMedia(null);
    setImgFiles(null);
    setCaption("");
    dispatch(CreatePostActions.setPostModalOpen(false));
  };
  const handleSharePost = async () => {
    try {
      if (imgFiles) {
        setShowLoader(true);
        const resp = await PostServices.createPost({
          content: caption,
          media: imgFiles,
        });
        setShowLoader(false);
        handleCloseModal();
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        setUploadedMedia(null);
        setImgFiles(null);
        setCaption("");
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
          {uploadedMedia && (
            <LeftArrowIcon width={20} height={20} customColor="white" />
          )}
          <span>Create new post</span>
          {uploadedMedia && (
            <span className="cursor-pointer" onClick={handleSharePost}>
              Share
            </span>
          )}
        </div>
        <div
          className={clsx(
            "flex flex-row items-center justify-center postModalDescription",
            { ["w-[560px]"]: uploadedMedia === null }
          )}
        >
          {uploadedMedia ? (
            <div className="createPostModalMediaWrapper">
              <MediaCarousel
                media={uploadedMedia.map((item) => ({
                  fileName: item.url,
                  type: item.type,
                }))}
              />
            </div>
          ) : (
            <div className="secondaryButton">
              <form encType="multipart/form-data">
                <label htmlFor="selectFromPc" className="cursor-pointer">
                  Select from computer
                </label>
                <input
                  id="selectFromPc"
                  type="file"
                  className="hidden"
                  name="postImg"
                  onChange={(event) => {
                    const imgs = event?.currentTarget?.files;
                    if (imgs) {
                      setImgFiles(imgs);
                      const fileReaders = Object.keys(imgs).map((index) => {
                        const reader = new Promise((resolve, reject) => {
                          const fileReader = new FileReader();
                          const mediaType =
                            imgs[parseInt(index)].type.split("/")[0];
                          fileReader.onload = async (event) => {
                            const imgUrl =
                              event?.target?.result?.toString() || null;
                            if (imgUrl) {
                              debugger;
                              resolve({
                                url: imgUrl,
                                type: mediaType,
                              });
                            } else {
                              reject({
                                url: "",
                                type: mediaType,
                              });
                            }
                          };
                          fileReader.readAsDataURL(imgs[parseInt(index)]);
                        });
                        return reader;
                      });
                      Promise.all(fileReaders)
                        .then((data) => {
                          debugger;
                          setUploadedMedia(data);
                        })
                        .catch(() => {
                          console.log("Error occured during reading files");
                        });
                    }
                  }}
                  multiple={true}
                />
              </form>
            </div>
          )}
          {uploadedMedia && (
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
        {showLoader && <UpdateLoader radius={25} />}
      </div>
    </Modal>
  );
};
