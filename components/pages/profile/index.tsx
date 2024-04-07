import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProfileTab, tabOptions } from "../../../constants/profileTabOptions";
import { userLoginInfo } from "../../../redux/reducers/AuthReducer";
import { Loader } from "../../shared/loaders/clipLoader";
import { ProfileService, UserProfile } from "../../../services/ProfileServices";
import { PostsGallery } from "./postsGallery";
import { PostDetails } from "../../home";
import { PostCommentsModal } from "../../modals/post-comments-model";

interface ProfileProps {
  username: string;
}
export const Profile = (props: ProfileProps) => {
  const { username } = props;
  const userInfo = useSelector(userLoginInfo);
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.POSTS);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostDetails[] | null>(null);
  const [skipNumber, setSkipNumber] = useState<number>(0);
  const [atEnd, setAtEnd] = useState<boolean>(false);
  const [postModalDetails, setPostModalDetails] = useState<PostDetails | null>(
    null
  );

  const fetchPosts = () => {
    ProfileService.getPosts(skipNumber, activeTab, userProfile?._id || "")
      .then((resp) => {
        setPosts((prev) => (prev ? [...prev, ...resp.data] : resp.data));
        setSkipNumber((prev) => prev + resp.data?.length || 0);
        setIsUpdating(false);
        if (resp.data?.length < 9) setAtEnd(true);
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
      });
  };

  useEffect(() => {
    if (userProfile) {
      setPosts(null);
      debugger;
      fetchPosts();
    }
  }, [activeTab, userProfile]);

  useEffect(() => {
    if (!userProfile || userProfile?.username !== username) {
      if (userInfo?.username === username) {
        setUserProfile(userInfo);
      } else {
        ProfileService.getProfile(username)
          .then((resp) => {
            setUserProfile(resp.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [username]);

  const handleFollowUnFollow = () => {
    setIsUpdating(true);
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

  const handleScroll = (event: any) => {
    const { scrollHeight, scrollTop } = event.target;
    if (
      scrollHeight - scrollTop - window.innerHeight < 200 &&
      !isUpdating &&
      !atEnd
    ) {
      setIsUpdating(true);
      fetchPosts();
    }
  };

  const onPostClick = (postData: PostDetails) => {
    setPostModalDetails(postData);
  };

  if (!userProfile) return <Loader />;
  return (
    <div
      className="w-full h-full overflow-auto md:ml-[72px] lg:ml-[244px] px-8 flex flex-col justify-start items-center"
      id="profileContainer"
      onScroll={handleScroll}
    >
      <div className="profilePageContainer mb-8">
        <div className="flex flex-row w-full mb-[44px] px-[20px] pt-[20px] ">
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
              <span>{userProfile.username}</span>
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
        <PostsGallery
          posts={posts}
          type={activeTab}
          handlePostClick={onPostClick}
        />
        <div className="profileFooter">{isUpdating && <Loader />}</div>
      </div>
      {postModalDetails && (
        <PostCommentsModal
          isOpen={!!postModalDetails}
          postDetails={postModalDetails}
          setPostDetails={setPostModalDetails}
        />
      )}
    </div>
  );
};
