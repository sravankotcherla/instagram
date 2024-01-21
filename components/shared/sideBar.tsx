import { InstaLogo } from "../../icons/InstaLogo";
import { barOptions } from "../../constants/barOptions";
import Link from "next/link";
import Image from "next/image";
import { InstaTextIcon } from "../../icons/instaTextIcon";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux/store";

export default function SideBar() {
  const router = useRouter();
  const userSessionInfo = useSelector(
    (state: ApplicationState) => state.auth.user
  );
  return (
    <div className="hidden md:flex items-start flex-col w-[72px] lg:w-[244px] h-[100vh] border-r-2 border-gray-700 px-3 py-2">
      <div className="w-full h-[92px]">
        <div className="lg:hidden w-full flex flex-row h-[73px] justify-center items-center mt-3 pb-[23px]">
          <InstaLogo customClass="" customColor="white" />
        </div>
        <div className="hidden lg:flex w-full h-[73px] px-3 pb-4 pt-[25px]  flex-row items-center mb-[19px]">
          <InstaTextIcon />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full ">
        {barOptions.map((option) => (
          <Link
            href={
              option.label === "Profile"
                ? `${option.route}/${userSessionInfo?.username || ""}`
                : option.route
            }
            key={option.label}
          >
            <div className="flex flex-row items-center justify-start w-full p-3 my-2 h-[48px] text-base cursor-pointer">
              <Image
                src={
                  option.label === "Profile" && userSessionInfo?.profileImg
                    ? userSessionInfo?.profileImg
                    : option.imgURL
                }
                alt={option.label}
                width={24}
                height={24}
                className="roundedToCircle"
              />
              <p className="hidden ml-4 text-white lg:flex">{option.label}</p>
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          router.push("/signIn");
        }}
        className="mt-auto mx-auto mb-8"
      >
        <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
      </button>
    </div>
  );
}
