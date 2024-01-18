import { authenticator } from "../../../../components/hoc/authenticator";
import { EditProfile } from "../../../../components/pages/profile/edit-profile";

const EditProfilePage = authenticator(() => {
  return <EditProfile />;
});

export default EditProfilePage;
