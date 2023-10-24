import BottomBar from "../components/shared/bottomBar";
import SideBar from "../components/shared/sideBar";
import TopBar from "../components/shared/topBar";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currPath = router.pathname;

  if (currPath === "/signUp" || currPath === "/signIn") {
    return <Component {...pageProps} />;
  }

  return (
    <main className="bg-black h-[100vh]">
      <TopBar />
      <div className="flex flex-row">
        <SideBar />
        <Component {...pageProps} />
      </div>
      <BottomBar />
    </main>
  );
}

export default MyApp;
