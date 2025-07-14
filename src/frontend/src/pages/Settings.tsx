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
            className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-gray-200"
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
        <div className="flex items-center gap-2">
          <button className="bg-[#faf6f9] text-sm md:text-base text-primary border border-gray-200 py-2 px-4 rounded-md font-karla-bold">
            Cancel
          </button>
          <button className="bg-primary text-sm md:text-base text-white py-2 px-4 rounded-md font-karla-bold ">
            Save
          </button>
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
