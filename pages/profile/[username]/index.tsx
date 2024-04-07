import { useRouter } from "next/router";
import { authenticator } from "../../../components/hoc/authenticator";
import { Profile } from "../../../components/pages/profile";
import { useSelector } from "react-redux";
import { userLoginInfo } from "../../../redux/reducers/AuthReducer";

const ProfilePage = authenticator(() => {
  const router = useRouter();
  const username = (router.query?.username as string) || "";

  return <Profile username={username} />;
});

export default ProfilePage;
