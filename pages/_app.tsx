import BottomBar from "../components/shared/bottomBar";
import SideBar from "../components/shared/sideBar";
import TopBar from "../components/shared/topBar";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currPath = router.pathname;

  if (currPath === "/signUp" || currPath === "/signIn") {
    return (
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </GoogleOAuthProvider>
    );
  }
  return (
    <main className="bg-black h-[100vh] text-white">
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <Provider store={store}>
          <TopBar />
          <div className="flex flex-row">
            <SideBar />
            <Component {...pageProps} />
          </div>
          <BottomBar />
        </Provider>
      </GoogleOAuthProvider>
    </main>
  );
}

export default MyApp;
