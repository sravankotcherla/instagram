import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { signUpFormFields } from "../../../constants/signUpFormFields";
import { InstaTextIcon } from "../../../icons/instaTextIcon";
import { AuthServices } from "../../../services/AuthServices";
import { AuthForm } from "../../forms/authForm";

export const SignUp = () => {
  const router = useRouter();
  const onSignUp = async (userDetails: { [key: string]: string }) => {
    try {
      await AuthServices.signUp(userDetails);
      router.push("/signIn");
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
        <p className="secondaryText font-semibold mb-4 ">
          Sign up to see photos and videos from your friends.
        </p>
        <div className="mb-[30px]">
          <AuthForm
            formFields={signUpFormFields}
            onSubmit={onSignUp}
            submitBtnText="Sign Up"
          />
        </div>
      </div>

      <div className="authSwitchBox text-[14px]">
        <p className="mr-2">Have an account?</p>
        <Link href={"/signIn"} className="text-[#0095f6]">
          Log In
        </Link>
      </div>
    </div>
  );
};
