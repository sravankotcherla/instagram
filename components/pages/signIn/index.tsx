import { signInFormFields } from "../../../constants/signUpFormFields";
import { InstaTextIcon } from "../../../icons/instaTextIcon";
import { AuthForm } from "../../forms/authForm";

export const SignIn = () => {
  const onSignIn = (userDetails: { [key: string]: string }) => {
    console.log(userDetails);
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
        </div>
      </div>

      <div className="authSwitchBox text-[14px]">
        <p className="mr-2">Have an account?</p>
        <a href="/signUp" className="text-[#0095f6]">
          Sign Up
        </a>
      </div>
    </div>
  );
};
