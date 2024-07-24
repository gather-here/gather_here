import ProfilePicture from "@/components/MyPage/MyInfo/ProfilePicture";
import ProfileInfo from "@/components/MyPage/MyInfo/ProfileInfo";

const MyInfo = () => {
  return (
    <div className="flex flex-col gap-4">
      <ProfilePicture />
      <ProfileInfo />
    </div>
  );
};

export default MyInfo;
