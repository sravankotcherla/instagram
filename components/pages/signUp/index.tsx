import { signUpFormFields } from "../../../constants/signUpFormFields";
import { InstaTextIcon } from "../../../icons/instaTextIcon";
import { AuthForm } from "../../forms/authForm";

export const SignUp = () => {
  const onSignUp = (userDetails: { [key: string]: string }) => {
    console.log(userDetails);
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
        <a href="/signIn" className="text-[#0095f6]">
          Log In
        </a>
      </div>
    </div>
  );
};
