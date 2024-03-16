import type { GetServerSideProps } from "next";
import { authenticator } from "../components/hoc/authenticator";
import { HomePosts } from "../components/home";
import { axiosInstance, PostServices } from "../services/PostServices";
import { AuthServices } from "../services/AuthServices";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies?.sessionToken) {
    return {
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        posts: [],
      },
    };
  }
};

const Home = authenticator((pageProps: any) => {
  const { posts } = pageProps;
  return <HomePosts posts={posts} />;
});

export default Home;
