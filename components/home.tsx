import { useEffect, useState } from "react";
import { PostServices } from "../services/PostServices";

export interface Post {
  _id: string;
  createdBy: string;
  createdAt: string;
  content: string;
  img: string;
  tags: string[];
  likes: number;
}
export interface HomeProps {
  posts: Post;
}
export const HomePosts = (props: HomeProps) => {
  const { posts } = props;

  console.log(posts);
  useEffect(() => {
    PostServices.fetchPosts(0)
      .then((resp) => {
        setPostsList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [postsList, setPostsList] = useState<any>(posts);

  return <p className="text-white">Home</p>;
};
