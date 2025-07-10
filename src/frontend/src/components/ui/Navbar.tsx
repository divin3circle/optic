import { motion } from "framer-motion";
import logo from "../../../assets/images/icon.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-background">
      <a href="/">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 100 }}
          className="flex items-center justify-center gap-2  p-2 rounded-3xl cursor-pointer"
        >
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-karla-bold text-primary">Optic</h1>
        </motion.div>
      </a>
      <div className="flex items-center gap-4 px-4">
        <button className="text-sm md:text-xl font-karla cursor-pointer text-gray-700 hover:text-[#e8492a] transition-all duration-300 hover:underline">
          Internet Identity
        </button>
        <button
          onClick={() => navigate("/onboard")}
          className="text-sm md:text-xl font-karla cursor-pointer text-gray-700  hover:text-[#e8492a] transition-all duration-300 hover:underline"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Navbar;
