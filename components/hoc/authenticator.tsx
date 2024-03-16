import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginInfo } from "../../redux/actions/Auth.actions";
import { userLoginInfo } from "../../redux/reducers/AuthReducer";
import { AuthServices } from "../../services/AuthServices";
import { MenuBarWrapper } from "../wrapper/menu-bar-wrapper";

export const authenticator = (
  WrappedComponent: (pageProps: any) => JSX.Element
) => {
  // eslint-disable-next-line react/display-name
  return function (pageProps: any) {
    const { sessionInfo } = pageProps;
    const router = useRouter();
    const dispatch = useDispatch();

    const session = useSelector(userLoginInfo);

    useEffect(() => {
      if (!session && !sessionInfo) {
        AuthServices.signIn({ email: null, password: null })
          .then((resp) => {
            dispatch(setUserLoginInfo(resp.data));
          })
          .catch((err) => {
            console.log(err, "can't get session");
            router.push("/signIn");
          });
      } else if (sessionInfo && !session) {
        dispatch(setUserLoginInfo(sessionInfo));
      }
    }, [session, sessionInfo]);

    if (session) {
      return <MenuBarWrapper>{WrappedComponent(pageProps)}</MenuBarWrapper>;
    }

    return null;
  };
};
