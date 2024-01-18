import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { genderOptions } from "../../../constants/profileGenderOptions";
import { setUserLoginInfo } from "../../../redux/actions/Auth.actions";
import { userLoginInfo } from "../../../redux/reducers/AuthReducer";
import {
  ProfileService,
  ProfileServicePayload,
} from "../../../services/ProfileServices";
import SelectionDropdown from "../../dropDowns/selectionDropdown";

export interface ProfileInfo {
  bio: string;
  profile_pic: string;
  gender?: string;
}
export interface GenderOption {
  value: string;
  type: string;
}
export const EditProfile = () => {
  const userInfo = useSelector(userLoginInfo);

  const dispatch = useDispatch();

  const [bioText, setBioText] = useState<string>(userInfo?.bio || "");
  const [profileImg, setProfileImg] = useState<string | undefined>(
    userInfo?.profileImg
  );
  const [gender, setGender] = useState<GenderOption | undefined>(
    userInfo?.gender || undefined
  );

  const updatedProfile = (payload: ProfileServicePayload) => {
    ProfileService.UpdateProfile(payload)
      .then((res) => {
        if (userInfo) {
          const updatedUserInfo = { ...userInfo, ...payload };
          dispatch(setUserLoginInfo(updatedUserInfo));
        }
      })
      .catch((err) => {
        console.log("Failed to update Profile", err);
      });
  };

  const onProfilePicUpload = (event: any) => {
    const imgFile = event.currentTarget.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imgFile);
    fileReader.onload = async (event) => {
      const imgUrl = event.target?.result?.toString();
      setProfileImg(imgUrl || "");
      updatedProfile({ profileImg: imgUrl || "" });
    };
  };

  return (
    <form className="flex justify-center w-full h-full">
      <div className="flex flex-col py-[36px] px-[48px] w-[700px] gap-8">
        <div className="font-bold py-3 mb-4 text-xl">Edit Profile</div>
        <div className="flex flex-row justify-between items-center p-4 changePhotoDiv">
          <div className="flex flex-row justify-start ">
            <Image
              src={profileImg || "/assets/user.svg"}
              alt="profile_pic"
              width={56}
              height={56}
              className="profileImgStyle cursor-pointer"
              onClick={() => {
                document.getElementById("profilePicUpload")?.click();
              }}
            />
            <div className="px-4">
              <span className="font-bold ">{userInfo?.username}</span>
              <br />
              <span className="text-primary">{userInfo?.name}</span>
            </div>
          </div>

          <div className="secondaryButton">
            <label htmlFor="profilePicUpload" className="cursor-pointer">
              Change Photo
            </label>
            <input
              type="file"
              id="profilePicUpload"
              placeholder="Change Photo"
              className="hidden cursor-pointer"
              accept="image/*"
              onChange={onProfilePicUpload}
            />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span>Bio</span>
          <textarea
            className="inputPrimary mt-4 w-full bioTextArea"
            placeholder="Bio"
            value={bioText}
            onChange={(event) => {
              setBioText(event.currentTarget.value);
              updatedProfile({
                bio: event.currentTarget.value,
              });
            }}
          ></textarea>
          <span className="ml-auto mr-2 mt-1 text-secondary text-xs">{`${bioText.length}/150`}</span>
        </div>
        <div className="flex flex-col">
          <span className="mb-4">Gender Selection</span>
          <SelectionDropdown
            value={gender?.value || ""}
            options={genderOptions}
            onOptionChange={(selectedOption) => {
              setGender(selectedOption);
              updatedProfile({ gender: selectedOption });
            }}
            isCustomSelected={gender?.type === "Custom" || false}
          />
        </div>
      </div>
    </form>
  );
};
