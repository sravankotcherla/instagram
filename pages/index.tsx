import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { authenticator } from "../components/hoc/authenticator";
import { HomePosts } from "../components/home";
import { axiosInstance, PostServices } from "../services/PostServices";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const interceptor = axiosInstance.interceptors.request.use((request) => {
    const sessionToken = context.req.cookies.sessionToken;
    request.headers.cookie = `sessionToken=${sessionToken}`;
    request.headers.host = context.req.headers.host;
    return request;
  });
  const resp = await PostServices.fetchPosts();
  axiosInstance.interceptors.request.eject(interceptor);
  return { props: { posts: resp.data } };
};

const Home = authenticator((pageProps: any) => {
  const { posts } = pageProps;
  console.log(pageProps, "pageProps");
  return <HomePosts posts={posts} />;
});

export default Home;
