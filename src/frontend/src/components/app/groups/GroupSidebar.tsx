import GroupSearchbar from "./GroupSearchbar";
import GroupList from "./GroupList";

function GroupSidebar() {
  return (
    <div className="flex flex-col gap-2 p-2 h-full overflow-y-auto">
      <GroupSearchbar />
      <GroupList />
    </div>
  );
}

export default GroupSidebar;
