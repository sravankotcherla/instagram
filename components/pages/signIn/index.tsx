import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { signInFormFields } from "../../../constants/signUpFormFields";
import { InstaTextIcon } from "../../../icons/instaTextIcon";
import { setUserLoginInfo } from "../../../redux/actions/Auth.actions";
import { AuthServices } from "../../../services/AuthServices";
import { AuthForm } from "../../forms/authForm";
import Image from "next/image";
import Link from "next/link";

export interface UserSingleSignInProfile {
  name: string;
  email: string;
  userId: string;
  profile_picture?: string;
}

export const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (resp) => {
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${resp.access_token}` },
        }
      );
      const user: UserSingleSignInProfile = {
        name: data.name,
        email: data.email,
        userId: data.sub,
        profile_picture: data.picture,
      };
      const response = await AuthServices.singleSignIn(user);
      dispatch(setUserLoginInfo(response.data));
      if (!response.data.newUser) {
        router.push("/");
      } else {
        router.push("/profile");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSignIn = async (userDetails: { [key: string]: string }) => {
    try {
      const { email, password } = userDetails;
      const resp = await AuthServices.signIn({ email, password });
      dispatch(setUserLoginInfo(resp.data.user));
      router.push("/");
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-[100vh] mt-10">
      <div className="authFormBox">
        <div className="mt-[36px] mb-3">
          <InstaTextIcon customColor="black" width={175} height={55} />
        </div>
        <div className="mb-[30px] mt-4">
          <AuthForm
            formFields={signInFormFields}
            onSubmit={onSignIn}
            submitBtnText="Log In"
          />
          <button
            onClick={() => {
              login();
            }}
            className="flex flex-row items-center justify-center singleSignInBtn mt-4"
          >
            <Image
              src="/assets/google.svg"
              alt="google"
              width={20}
              height={20}
            />
            <span className="ml-2">Login With Google</span>
          </button>
        </div>
      </div>

      <div className="authSwitchBox text-[14px]">
        <p className="mr-2">Have an account?</p>
        <Link href={"/signUp"} className="text-[#0095f6]">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
