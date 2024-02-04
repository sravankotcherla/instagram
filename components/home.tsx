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
    <div className="text-white flex flex-col w-full h-full items-center pt-5 overflow-scroll">
      {postsList.map((postItem) => {
        return <PostCard key={postItem._id} postDetails={postItem} />;
      })}
    </div>
  );
};
