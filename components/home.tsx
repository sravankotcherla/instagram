import { useEffect, useState } from "react";
import { PostServices } from "../services/PostServices";

export const HomePosts = () => {
  useEffect(() => {
    fetchPosts();
  }, []);

  const [posts, setPosts] = useState<any>([]);
  const fetchPosts = async () => {
    try {
      const posts = await PostServices.fetchPosts();
      setPosts(posts);
    } catch (err) {
      console.log(err);
    }
  };
  return <p className="text-white">Home</p>;
};
