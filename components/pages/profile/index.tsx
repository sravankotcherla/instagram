import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { tabOptions } from "../../../constants/profileTabOptions";
import { userLoginInfo } from "../../../redux/reducers/AuthReducer";
import { Loader } from "../../shared/loaders/clipLoader";
import { ProfileService, UserProfile } from "../../../services/ProfileServices";

interface ProfileProps {
  username: string;
}
export const Profile = (props: ProfileProps) => {
  const { username } = props;
  const userInfo = useSelector(userLoginInfo);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    userInfo?.username === username ? userInfo : null
  );
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!userProfile) {
      ProfileService.getProfile(username)
        .then((resp) => {
          debugger;
          setUserProfile(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userProfile]);

  const handleFollowUnFollow = () => {
    setIsUpdating(true);
    debugger;
    if (userProfile) {
      ProfileService.follow(userProfile._id, !userProfile.isFollowed)
        .then((resp) => {
          console.log(resp);
          setUserProfile({ ...resp.data, isFollowed: !userProfile.isFollowed });
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };

  if (!userProfile) return <Loader />;
  return (
    <div className="mb-[30px] w-full md:ml-[72px] lg:ml-[244px] ">
      <div className="flex flex-row w-full mb-[44px] px-[20px] pt-[20px]">
        <div className="flex flex-row profileImageDiv">
          <Image
            src={userProfile?.profileImg || "/assets/user.svg"}
            width={150}
            height={150}
            alt="profile image"
            className="roundedToCircle flex-shrink-0"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row  items-center gap-5 mb-5">
            <span>{username}</span>
            {userInfo?.username === username ? (
              <>
                <button
                  className="primaryButton"
                  onClick={() => {
                    router.push(`/profile/${username}/edit`);
                  }}
                >
                  Edit profile
                </button>
                <button className="primaryButton">Logout</button>
              </>
            ) : (
              <button
                className="secondaryButton"
                onClick={() => {
                  if (userProfile) handleFollowUnFollow();
                }}
              >
                {`${userProfile?.isFollowed ? "Unfollow" : "Follow"}`}
              </button>
            )}
          </div>

          <div className="flex flex-row  items-center gap-5 mb-5">
            <span>{`${userProfile?.posts?.length || 0} posts`}</span>
            <span>{`${userProfile?.followers || 0} followers`}</span>
            <span>{`${userProfile?.following || 0} following`}</span>
          </div>
          <div>{userProfile?.name}</div>
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
