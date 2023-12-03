import type { NextPage } from "next";
import { authenticator } from "../components/hoc/authenticator";
import { HomePosts } from "../components/home";

const Home: NextPage = authenticator(() => {
  return <HomePosts />;
});

export default Home;
