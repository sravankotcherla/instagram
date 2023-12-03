import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserLoginInfo,
  UpdateAuthToken,
} from "../../redux/actions/Auth.actions";
import { authTokenSelector } from "../../redux/reducers/AuthReducer";
import { AuthServices } from "../../services/AuthServices";

export const authenticator = (WrappedComponent: any) => {
  return function () {
    const router = useRouter();
    const dispatch = useDispatch();

    const sessionToken = useSelector(authTokenSelector);

    useEffect(() => {
      if (!sessionToken) {
        AuthServices.signIn({ email: null, password: null })
          .then((resp) => {
            dispatch(UpdateAuthToken(resp.data.token));
            dispatch(setUserLoginInfo(resp.data.user));
          })
          .catch((err) => {
            console.log(err);
            router.push("/signIn");
          });
      }
    }, []);

    if (sessionToken) {
      return WrappedComponent();
    }

    return null;
  };
};
