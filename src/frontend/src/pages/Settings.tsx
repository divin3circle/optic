import { Button } from "@/components/ui/button";
import dummy from "../../assets/images/message.webp";
import useUserStore from "../../store/user";
import { useUser } from "../../hooks/useUser";
import Loading from "@/components/ui/Loading";
import SettingsSkeleton from "@/skeletons/settings";
import { FaDotCircle, FaGlobe } from "react-icons/fa";

function Settings() {
  const user = useUserStore((state) => state.user);
  const { loading } = useUser();

  if (!user) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="">
      <h1 className="text-primary text-2xl font-karla-bold">Settings</h1>
      <p className="text-gray-500 text-sm font-karla">
        Manage your account settings and preferences.
      </p>
      <div className="flex items-center justify-between my-4 border border-gray-200 rounded-2xl p-4 bg-[#faf6f7] mx-0 md:mx-2">
        <div className="flex items-center gap-2">
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-18 h-18 md:w-20 md:h-20 rounded-full border border-gray-200"
          />
          <div>
            <h1 className="text-primary text-lg md:text-2xl font-karla">
              {user.username}
            </h1>
            <p className="text-gray-500 text-sm font-karla flex items-center gap-2">
              <FaGlobe className="text-primary" />
              {user.nationality.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-2 flex-col w-full">
          <button className="bg-[#e8492a] text-sm md:text-base text-white p-2 w-full md:w-1/4 rounded-md font-karla-bold ">
            Claim Rewards
          </button>
          <p className="text-gray-500 text-xs md:text-sm font-karla">
            You have 1 ICP in claimable rewards.
          </p>
        </div>
      </div>
      <h1 className="text-primary text-2xl font-karla-bold mt-8">
        Edit Profile
      </h1>
      <p className="text-gray-500 text-sm font-karla text-center my-4">
        Unfortunately you cannot edit your profile yet.
      </p>
    </div>
  );
}

export default Settings;
