import Particles from "../../../blocks/Backgrounds/Particles/Particles";
import TrueFocus from "../../../blocks/TextAnimations/TrueFocus/TrueFocus";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animation from "../../../../assets/lottie/messaging.json";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="mt-8 flex flex-col items-center gap-2 w-full p-2">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 100 }}
          className="text-xl w-full md:text-3xl font-karla-bold text-primary md:text-center flex flex-col items-center gap-2 mt-8"
        >
          Coordinate. Contribute. Compound.
          <TrueFocus
            sentence="Fully On-Chain"
            manualMode={false}
            blurAmount={5}
            borderColor="#e8492a"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 100 }}
          className="md:text-xl text-sm font-karla text-gray-500 text-center mt-8"
        >
          Optic lets you chat, pool ICP with your group, and let smart agents
          grow your funds — all transparently on the Internet Computer
        </motion.p>
        <div className="flex flex-col md:flex-row gap-4 mt-12 justify-center items-center md:gap-8">
          <button
            onClick={() => navigate("/onboard")}
            className="md:text-xl text-sm font-karla-semi-bold text-[#e8492a] border-2 border-[#e8492a] p-3 rounded-full hover:bg-secondary hover:text-primary transition-all duration-300"
          >
            Begin Your Journey
          </button>
          <button className="md:text-xl text-sm font-karla-semi-bold text-primary underline">
            Learn More
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <Lottie animationData={animation} loop={true} />
      </div>
    </div>
  );
}

export default Hero;
