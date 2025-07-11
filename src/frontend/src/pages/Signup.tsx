import { motion } from "framer-motion";
import logo from "../../assets/images/icon.png";
import message from "../../assets/images/message.webp";
import message2 from "../../assets/images/messages2.webp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "../../types/user";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlags } from "../../hooks/useFlags.js";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "@nfid/identitykit/react";
import { createActor, canisterId } from "../../../declarations/backend";
import Loading, { ButtonLoading } from "@/components/ui/Loading";

function Signup() {
  const { user } = useAuth();
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { data } = useFlags();
  const navigate = useNavigate();

  const handleNext = () => {
    switch (step) {
      case 1:
        setStep(2);
        break;
      case 2:
        if (!user) return;
        setLoading(true);
        const registeredUser: User = {
          id: user.principal.toString(),
          username: username,
          nationality: country,
          profileImage: profileImage || "",
          evmAddress: "",
          btcAddress: "",
          chatStatus: "offline",
          lastOnline: BigInt(0),
          reputationScore: 0,
          subscriptionStatus: { type: "free", expiresIn: BigInt(0) },
          theme: "light",
          balances: { icp: 0, ckBTC: 0, evm: 0 },
          plugins: [],
          notifications: [],
          chatRooms: [],
          personalChatRooms: [],
        };
        console.log(registeredUser);
        const backend = createActor(canisterId);
        backend.create_user(registeredUser).then((res) => {
          console.log("backend response", res);
          setLoading(false);
          navigate("/otp");
        });

        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-full md:w-[60%] flex flex-col-reverse md:flex-row gap-2 bg-background p-1.5 rounded-xl">
        <div className="w-full md:w-1/2">
          <motion.img
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: 100 }}
            src={step === 1 ? message : message2}
            alt="message"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-2 p-4 rounded-3xl w-full md:w-1/2">
          <a href="/">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex items-center justify-center gap-1 p-2 rounded-3xl cursor-pointer"
            >
              <img src={logo} alt="logo" className="w-6 h-6" />
              <h1 className="text-lg font-karla-bold text-primary">Optic</h1>
            </motion.div>
          </a>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: 100 }}
            className="flex flex-col gap-1"
          >
            <h1 className="text-xl font-karla-semi-bold text-center text-primary">
              {step === 1 ? "Create an account" : "Finalize your account"}
            </h1>
            <p className="text-sm font-karla text-center text-gray-500">
              {step === 1
                ? "Start your journey with Optic"
                : "Get started with the messaging app for the future"}
            </p>
          </motion.div>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex flex-col gap-4 mt-4"
            >
              <div>
                <Label className="text-sm font-karla-semi-bold text-primary">
                  Profile Image
                </Label>

                {profileImage ? (
                  <div className="flex items-center justify-center cursor-pointer gap-2 w-20 h-20 rounded-full border-[1px] border-gray-400">
                    <img
                      src={profileImage}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <Input
                    placeholder="Profile Image Link"
                    className="h-10 rounded-2xl mt-2 text-primary"
                    value={profileImage || ""}
                    onChange={(e) => setProfileImage(e.target.value)}
                  />
                )}
              </div>
              <div className="mt-4">
                <Label className="text-sm font-karla-semi-bold text-primary">
                  Username{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="Username"
                  className="h-10 rounded-2xl mt-2 text-primary"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="mt-4">
                <Label className="text-sm font-karla-semi-bold text-primary">
                  Nationality
                </Label>
                <Select
                  value={country}
                  onValueChange={(value) => setCountry(value)}
                >
                  <SelectTrigger className="w-full h-10 rounded-2xl mt-2 text-primary">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      {data?.map((flag, index) => (
                        <SelectItem
                          key={index}
                          value={flag.name}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={flag.flag}
                            alt={flag.name}
                            className="w-4 h-4"
                          />
                          {flag.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label className="text-sm font-karla-semi-bold text-primary">
                  Phone Number
                </Label>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-10 p-1 rounded-xl border-[1px] border-gray-300 mt-2 flex items-center justify-center">
                    <img
                      src={data?.find((flag) => flag.name === country)?.flag}
                      alt={country}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    className="h-10 rounded-2xl mt-2 text-primary"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: 100 }}
            className="flex items-end justify-end mt-8 gap-2"
          >
            {step === 2 && (
              <Button
                onClick={() => setStep(1)}
                className="w-full md:w-44 h-10 rounded-full bg-transparent shadow-none text-primary hover:bg-transparent hover:text-primary flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-6 h-6 mb-1" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="w-full md:w-44 h-10 text-white rounded-full bg-[#e8492a] disabled:bg-gray-300 disabled:opacity-100"
              disabled={loading}
            >
              {loading ? <ButtonLoading /> : step === 1 ? "Next" : "Finish"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
