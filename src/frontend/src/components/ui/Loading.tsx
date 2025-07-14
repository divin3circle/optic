import { motion } from "framer-motion";
import logo from "../../../assets/images/icon.png";

export const ButtonLoading = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <img src={logo} alt="logo" className="w-4 h-4 animate-bounce" />
      <h1 className="text-sm font-karla text-black">Processing ...</h1>
    </div>
  );
};

export const LoadingSmall = () => {
  return (
    <div className="flex items-center justify-center gap-2 my-8">
      <img src={logo} alt="logo" className="w-4 h-4 animate-bounce" />
    </div>
  );
};

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.img
        src={logo}
        alt="logo"
        className="w-10 h-10 animate-bounce"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      />
      <h1 className="text-2xl font-karla text-primary">Just a moment ...</h1>
    </div>
  );
}

export default Loading;
