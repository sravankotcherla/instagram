import { PostDetails } from "../home";

interface PostCardProps {
  postDetails: PostDetails;
}

export const PostCard = (props: PostCardProps) => {
  const { postDetails } = props;
  return <div>{postDetails._id}</div>;
};
