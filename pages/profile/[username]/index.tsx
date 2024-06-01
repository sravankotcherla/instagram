import { useRouter } from "next/router";
import { authenticator } from "../../../components/hoc/authenticator";
import { Profile } from "../../../components/pages/profile";

const ProfilePage = authenticator(() => {
  const router = useRouter();
  const username = (router.query?.username as string) || "";

  return <Profile username={username} />;
});

export default ProfilePage;
