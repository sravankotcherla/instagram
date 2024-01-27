import type { NextPage } from "next";
import { authenticator } from "../components/hoc/authenticator";
import { HomePosts } from "../components/home";
import queryString from "query-string";
import { axiosInstance, PostServices } from "../services/PostServices";

const Home: NextPage = authenticator((pageProps: any) => {
  const posts = { pageProps };
  return <HomePosts posts={posts} />;
});

export const getServerSideProps = async (context: any) => {
  const sessionToken = context.req.cookies.sessionToken;
  console.log(sessionToken);

  const interceptor = axiosInstance.interceptors.request.use((request) => {
    const sessionToken = context.req.cookies.sessionToken;
    request.headers.cookie = `sessionToken=${sessionToken}`;
    request.headers.host = context.req.headers.host;
    console.log("interceptor", request.headers.cookie);
    return request;
  });
  return PostServices.fetchPosts()
    .then((resp) => {
      const posts = resp.data;
      console.log("PostsData", posts, axiosInstance.interceptors.request);
      axiosInstance.interceptors.request.eject(interceptor);
      return { props: { posts: posts } };
    })
    .catch((err) => {
      console.log(err);
      axiosInstance.interceptors.request.eject(interceptor);
      return { props: { posts: [] } };
    });

  return;
};

export default Home;
