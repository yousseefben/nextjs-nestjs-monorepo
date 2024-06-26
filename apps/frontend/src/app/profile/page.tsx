import { getUserInfos } from "@frontend/src/api/api";
import Carousel from "@frontend/src/components/carousel/Carousel";
import ProfileCard from "@frontend/src/components/profile/profile-card";

export default async function Profile() {
  const profile = await getUserInfos();
  const { fullName, email, avatar, photos } = profile || {};

  return (
    <div>
      <ProfileCard fullName={fullName} email={email} avatar={avatar} />
      <div className="my-4">
        <Carousel photos={photos} />
      </div>
    </div>
  );
}
