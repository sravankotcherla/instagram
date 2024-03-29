import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MenuBarWrapper } from "../components/wrapper/menu-bar-wrapper";

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
    <main>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <Provider store={store}>{<Component {...pageProps} />}</Provider>
      </GoogleOAuthProvider>
    </main>
  );
}

export default MyApp;
