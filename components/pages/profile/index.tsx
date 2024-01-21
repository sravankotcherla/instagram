import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { tabOptions } from "../../../constants/profileTabOptions";
import { userLoginInfo } from "../../../redux/reducers/AuthReducer";

interface ProfileProps {
  username: string;
}
export const Profile = (props: ProfileProps) => {
  const { username } = props;
  const userInfo = useSelector(userLoginInfo);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("posts");
  return (
    <div className="mx-[110px] mb-[30px] w-full">
      <div className="flex flex-row w-full mb-[44px] px-[20px] pt-[20px]">
        <div className="flex flex-row profileImageDiv">
          <Image
            src={userInfo?.profileImg || "/assets/user.svg"}
            width={150}
            height={150}
            alt="profile image"
            className="roundedToCircle"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row  items-center gap-5 mb-5">
            <span>{username}</span>
            <button
              className="primaryButton"
              onClick={() => {
                router.push(`/profile/${username}/edit`);
              }}
            >
              Edit profile
            </button>
            <button className="primaryButton">Logout</button>
          </div>
          <div className="flex flex-row  items-center gap-5 mb-5">
            <span>{`${userInfo?.posts?.length || 0} posts`}</span>
            <span>{`${userInfo?.followers || 0} followers`}</span>
            <span>{`${userInfo?.following || 0} following`}</span>
          </div>
          <div>{userInfo?.name}</div>
        </div>
      </div>
      <div>
        <div className="flex flex-row justify-center gap-8 tabsHeader">
          {tabOptions.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex items-center text-[#a8a8a8] text-xs cursor-pointer ${
                  activeTab === item.id ? "activeTab" : ""
                }`}
                onClick={(event) => {
                  const activeTabId = tabOptions.find(
                    (option) => option.label === event.currentTarget.innerText
                  );
                  setActiveTab(activeTabId?.id || tabOptions[0].id);
                }}
              >
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div></div>
      </div>
    </div>
  );
};
