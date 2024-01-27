import { useEffect, useState } from "react";
import { PostServices } from "../services/PostServices";
import { PostCard } from "./posts/post-card";

export interface PostDetails {
  _id: string;
  createdBy: string;
  createdAt: string;
  content: string;
  img: string;
  tags: string[];
  likes: number;
}
export interface HomeProps {
  posts: any;
}
export const HomePosts = (props: HomeProps) => {
  const { posts } = props;

  const [postsList, setPostsList] = useState<PostDetails[]>(posts);

  return (
    <div>
      <span>Home</span>
      <div className="text-white">
        {postsList.map((postItem) => {
          return <PostCard key={postItem._id} postDetails={postItem} />;
        })}
      </div>
    </div>
  );
};
