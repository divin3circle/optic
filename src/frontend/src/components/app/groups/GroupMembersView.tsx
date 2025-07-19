import React from "react";
import { Principal } from "@dfinity/principal";
import { useGetUsersByPrincipal } from "../../../../hooks/useUser";
import { LoadingSmall } from "@/components/ui/Loading";
import dummy from "../../../../assets/images/message.webp";

function GroupMembersView({ members }: { members: Principal[] }) {
  const { data, isLoading } = useGetUsersByPrincipal(members);

  if (isLoading) {
    return <LoadingSmall />;
  }
  if (!data) {
    return <div className="text-sm text-gray-500 font-karla">No data</div>;
  }
  return (
    <div className="flex items-center justify-start -space-x-4">
      {data.slice(0, 5).map((user, index) => (
        <div key={index} className="flex items-center justify-center">
          <img
            src={user[0]?.profileImage || dummy}
            alt="User Profile"
            className="w-12 h-12 rounded-full border-1 border-gray-200"
          />
        </div>
      ))}
      {members.length > 5 && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#faf6f9] border-1 border-gray-200">
          <p className="text-sm text-gray-500 font-karla">
            +{members.length - 5}
          </p>
        </div>
      )}
    </div>
  );
}

export default GroupMembersView;
