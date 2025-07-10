import Hyperspeed from "../../../blocks/Backgrounds/Hyperspeed/Hyperspeed";
import TrueFocus from "../../../blocks/TextAnimations/TrueFocus/TrueFocus";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen relative">
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-full p-2">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 100 }}
          className="text-xl w-full md:text-5xl font-karla-bold text-primary md:text-center flex flex-col items-center gap-2 mt-8"
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
          className="md:text-2xl text-sm font-karla text-gray-500 text-center mt-8"
        >
          Optic lets you chat, pool ICP with your group, and let smart agents
          grow your funds — all transparently on the Internet Computer
        </motion.p>
        <div className="flex flex-col md:flex-row gap-4 mt-12 justify-center items-center md:gap-8">
          <button
            onClick={() => navigate("/onboard")}
            className="md:text-2xl text-sm font-karla-semi-bold text-[#e8492a] border-2 border-[#e8492a] p-3 rounded-full hover:bg-secondary hover:text-primary transition-all duration-300"
          >
            Begin Your Journey
          </button>
          <button className="md:text-2xl text-sm font-karla-semi-bold text-primary underline">
            Learn More
          </button>
        </div>
      </div>
      <Hyperspeed
        effectOptions={{
          onSpeedUp: () => {
            // render a text
          },
          onSlowDown: () => {},
          distortion: "turbulentDistortion",
          length: 400,
          roadWidth: 10,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0xe8492a,
            islandColor: 0xe8492a,
            background: 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
            sticks: 0x03b3c3,
          },
        }}
      />
    </div>
  );
}

export default Hero;
