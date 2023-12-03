import { authenticator } from "../../components/hoc/authenticator";

const ProfilePage = authenticator(() => {
  return <div className="text-white">Profile</div>;
});

export default ProfilePage;
