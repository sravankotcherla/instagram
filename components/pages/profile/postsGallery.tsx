import { ProfileTab } from "../../../constants/profileTabOptions";
import { PostDetails } from "../../home";
import { Loader } from "../../shared/loaders/clipLoader";

interface PostsGalleryProps {
  type: ProfileTab;
  posts: PostDetails[] | null;
  handlePostClick: (post: PostDetails) => void;
}
export const PostsGallery = (props: PostsGalleryProps) => {
  const { type, posts, handlePostClick } = props;

  if (!posts) {
    return (
      <div className="h-full w-full">
        <Loader />;
      </div>
    );
  }

  return (
    <div className="postsGallery">
      {posts.map((post) => {
        return (
          <div
            key={post._id}
            className="postsGalleryItem"
            onClick={(e) => {
              e.preventDefault();
              handlePostClick(post);
            }}
          >
            <img
              src={`/${post._id}.${post.img.split(".").slice(-1)[0]}`}
              alt="media"
              className="postsGalleryImg"
            />
          </div>
        );
      })}
    </div>
  );
};
