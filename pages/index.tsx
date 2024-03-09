import { authenticator } from "../components/hoc/authenticator";
import { HomePosts } from "../components/home";

const Home = authenticator((pageProps: any) => {
  const { posts } = pageProps;
  return <HomePosts posts={posts} />;
});

export default Home;
