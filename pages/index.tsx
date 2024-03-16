import type { GetServerSideProps } from "next";
import { authenticator } from "../components/hoc/authenticator";
import { HomePosts } from "../components/home";
import { axiosInstance, PostServices } from "../services/PostServices";
import { AuthServices } from "../services/AuthServices";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const reqInterceptor = axiosInstance.interceptors.request.use((config) => {
    console.log(context.req);
    config.headers.host = context.req.headers.host;
    config.headers.cookie = context.req.headers.cookie;
    return config;
  });
  return AuthServices.signIn({ email: null, password: null })
    .then((resp) => {
      return {
        props: {
          sessionInfo: resp.data,
          posts: [],
        },
      };
    })
    .catch((err) => {
      return {
        redirect: {
          destination: "/signIn",
          permanent: false,
        },
      };
    })
    .finally(() => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
    });
};

const Home = authenticator((pageProps: any) => {
  const { posts } = pageProps;
  return <HomePosts posts={posts} />;
});

export default Home;
