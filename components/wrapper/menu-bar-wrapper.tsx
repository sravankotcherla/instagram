import { optionClasses } from "@mui/base";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { barOptions } from "../../constants/barOptions";
import { CreatePostActions } from "../../redux/actions/CreatePost.actions";
import { userLoginInfo } from "../../redux/reducers/AuthReducer";
import { postModalSelector } from "../../redux/reducers/CreatePostReducer";
import { CreatePostModal } from "../modals/create-post-modal";
import BottomBar from "../shared/bottomBar";
import SideBar from "../shared/sideBar";
import TopBar from "../shared/topBar";

export const MenuBarWrapper = (props: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const postModalInfo = useSelector(postModalSelector);
  const userSessionInfo = useSelector(userLoginInfo);
  const modifiedBarOptions = barOptions.map((option) => {
    option["onClick"] = () => {
      if (option.route) {
        router.push(
          option.label === "Profile"
            ? `${option.route}/${userSessionInfo?.username || ""}`
            : option.route
        );
      } else {
        dispatch(CreatePostActions.setPostModalOpen(true));
      }
    };
    return option;
  });
  return (
    <>
      <TopBar />
      <div className="flex flex-row">
        <SideBar options={modifiedBarOptions} />
        {props.children}
      </div>
      <BottomBar options={modifiedBarOptions} />
      <CreatePostModal open={postModalInfo?.isModalOpen} />
    </>
  );
};
