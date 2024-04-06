import { InstaLogo } from "../../icons/InstaLogo";
import { barOptionInterface } from "../../constants/barOptions";
import Image from "next/image";
import { InstaTextIcon } from "../../icons/instaTextIcon";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../redux/store";
import { CreatePostActions } from "../../redux/actions/CreatePost.actions";
import { AuthServices } from "../../services/AuthServices";
import { useState } from "react";
import clsx from "clsx";
import SideNavProfileSearch from "../pages/search/sideNav-profile-search";

export default function SideBar(props: { options: barOptionInterface[] }) {
  const { options } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const userSessionInfo = useSelector(
    (state: ApplicationState) => state.auth.user
  );

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const handleClickedOption = (option: barOptionInterface) => {
    switch (option.label) {
      case "Profile":
        router.push(`${option.route}/${userSessionInfo?.username || ""}`);
        break;
      case "Create":
        dispatch(CreatePostActions.setPostModalOpen(true));
        break;
      case "Search":
        setIsSearchOpen(!isSearchOpen);
        break;
      default:
        router.push(option.route || "/");
    }
  };
  return (
    <div className="flex flex-row absolute bg-black z-50">
      <div
        className={clsx(
          "hidden md:flex items-start flex-col w-[72px] lg:w-[244px] h-[100vh] px-3 py-2 sideNavBar",
          { ["searchTransition"]: isSearchOpen }
        )}
      >
        <div className="w-full h-[92px]">
          <div
            className={clsx(
              "lg:hidden w-full flex flex-row h-[80px] justify-center items-center mt-3 pb-[32px]",
              { ["displayHard"]: isSearchOpen }
            )}
          >
            <InstaLogo customColor="white" customClass="flex-shrink-0" />
          </div>
          <div
            className={clsx(
              "hidden  lg:flex  w-full h-[73px] px-3 pb-4 pt-[25px]  flex-row items-center mb-[19px]",
              { ["hideHard"]: isSearchOpen }
            )}
          >
            <InstaTextIcon />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full ">
          {options.map((option) => (
            <div
              key={option.label}
              className="flex flex-row items-center justify-start w-full p-3 my-2 h-[48px] text-base cursor-pointer"
              onClick={() => {
                handleClickedOption(option);
              }}
            >
              <Image
                src={
                  option.label === "Profile" && userSessionInfo?.profileImg
                    ? userSessionInfo?.profileImg
                    : option.imgURL
                }
                alt={option.label}
                width={24}
                height={24}
                className={clsx("roundedToCircle flex-shrink-1 sideNavLogos")}
              />
              <p
                className={clsx("hidden ml-4 text-white lg:flex", {
                  ["hideHard"]: isSearchOpen,
                })}
              >
                {option.label}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            AuthServices.logout()
              .then(() => {
                router.push("/signIn");
              })
              .catch((err) => {
                console.log("Failed to logout", err);
              });
          }}
          className="flex flex-row items-center justify-start w-full p-3 mt-auto mb-4 h-[48px] text-base cursor-pointer"
        >
          <Image
            src="/assets/logout.svg"
            alt="logout"
            width={24}
            height={24}
            className="flex-shrink-1"
          />
          <span className="hidden ml-4 text-white lg:flex">Logout</span>
        </button>
      </div>
      <SideNavProfileSearch isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </div>
  );
}
