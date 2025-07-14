import { IoCheckmarkDoneOutline } from "react-icons/io5";
import dummy from "../../../../assets/images/message.webp";
import { WiMoonAltNew } from "react-icons/wi";

function NotificationCard() {
  return (
    <div className="bg-[#faf9f6] rounded-3xl border border-gray-200 p-4 flex items-center gap-2 relative cursor-pointer hover:bg-[#fff] transition-all duration-300">
      <img src={dummy} alt="dummy" className="w-14 h-14 rounded-xl" />
      <div className="flex flex-col">
        <h1 className="text-primary text-lg font-karla-bold">
          You have a new message
        </h1>
        <p className="text-gray-500 text-sm font-karla">
          You have a new message from John Doe.
        </p>
        <p className="text-gray-500 text-xs font-karla">
          June 13, 2025 12:00 PM
        </p>
      </div>

      <WiMoonAltNew className="text-[#e8492a] text-sm absolute right-2 top-2" />
    </div>
  );
}

export default NotificationCard;
