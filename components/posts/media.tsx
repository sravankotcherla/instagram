import { PostDetails } from "../home";
import { MediaCarousel } from "../media/carousel";

interface MediaPlayerProps {
  postData: PostDetails;
}

export const MediaPlayer = (props: MediaPlayerProps) => {
  const { postData } = props;

  return (
    <div
      id="postCardMedia"
      className="flex items-center justify-center postCardMedia w-[470px] h-[585px] overflow-hidden"
    >
      <MediaCarousel media={postData.media} />
    </div>
  );
};
