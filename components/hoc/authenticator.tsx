import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginInfo } from "../../redux/actions/Auth.actions";
import { userLoginInfo } from "../../redux/reducers/AuthReducer";
import { AuthServices } from "../../services/AuthServices";

export const authenticator = (
  WrappedComponent: (pageProps: any) => JSX.Element
) => {
  return function (pageProps: any) {
    const router = useRouter();
    const dispatch = useDispatch();

    const session = useSelector(userLoginInfo);

    useEffect(() => {
      if (!session) {
        AuthServices.signIn({ email: null, password: null })
          .then((resp) => {
            dispatch(setUserLoginInfo(resp.data));
          })
          .catch((err) => {
            console.log(err);
            router.push("/signIn");
          });
      }
    }, []);

    if (session) {
      return WrappedComponent(pageProps);
    }

    return null;
  };
};
