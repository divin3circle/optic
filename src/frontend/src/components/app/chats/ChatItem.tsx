import dummy from "../../../../assets/images/message.webp";

function ChatItem() {
  return (
    <div className="border-b-[.5px] border-gray-300 flex items-center justify-between gap-2 pb-4 my-2 cursor-pointer hover:bg-[#fff] rounded-sm p-2 transition-all duration-300">
      <div className="flex items-center gap-2">
        <img src={dummy} alt="dummy" className="w-12 h-12 rounded-full" />
        <div className="flex flex-col">
          <h1 className="text-gray-700 text-sm font-karla-semi-bold">
            Chat Item
          </h1>
          <p className="text-gray-500 text-xs font-karla">
            Sample message from a user who types a lot of...
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-end items-end">
        <p className="text-gray-500 text-xs font-karla">22:45</p>
        <p className="text-xs font-karla bg-[#e8492a] text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          12
        </p>
      </div>
    </div>
  );
}

export default ChatItem;
