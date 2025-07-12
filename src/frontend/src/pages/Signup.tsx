import { motion } from "framer-motion";
import logo from "../../assets/images/icon.png";
import message from "../../assets/images/message.webp";
import message2 from "../../assets/images/messages2.webp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "../../types/user";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useAuth } from "@nfid/identitykit/react";
import { backend } from "../../utils";
import Loading, { ButtonLoading } from "@/components/ui/Loading";
import { useCheckUserOnboarding } from "../../hooks/useCheckUserOnboarding.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signup";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";

function Signup() {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      country: "",
      profileImage: "",
      phoneNumber: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const { checkingUser } = useCheckUserOnboarding();
  const [step, setStep] = useState(1);
  const { data } = useFlags();
  const navigate = useNavigate();

  if (checkingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

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
          username: form.getValues("username"),
          nationality: form.getValues("country"),
          profileImage: form.getValues("profileImage") || "",
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

  function onSubmit(values: z.infer<typeof signupSchema>) {
    handleNext();
    console.log(values);
  }

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="flex flex-col gap-4 mt-4"
                >
                  <div>
                    {form.watch("profileImage") ? (
                      <div className="flex relative items-center justify-center cursor-pointer gap-2 w-20 h-20 rounded-full border-[1px] border-gray-400">
                        <img
                          src={form.watch("profileImage")}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div
                          className="w-4 h-4 text-[#e8492a] bg-white absolute top-0 right-1 cursor-pointer"
                          onClick={() => form.setValue("profileImage", "")}
                        >
                          <XIcon className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-karla-semi-bold text-primary">
                              Profile Image
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-10 rounded-2xl mt-2 text-primary"
                                placeholder="https://example.com/image.png"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-sm font-karla text-gray-500">
                              Profile images help other users recognize you.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-karla-semi-bold text-primary">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Username"
                              className="h-10 rounded-2xl mt-2 text-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-sm font-karla text-gray-500">
                            This is your unique public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
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
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-karla-semi-bold text-primary">
                            Nationality
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 rounded-2xl mt-2 text-primary w-full">
                                  <SelectValue placeholder="Select a country" />
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
                                </SelectTrigger>
                              </FormControl>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-karla-semi-bold text-primary">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="+254 701 838 690"
                              className="h-10 rounded-2xl mt-2 text-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  type="submit"
                  onClick={handleNext}
                  className="w-full md:w-44 h-10 text-white rounded-full bg-[#e8492a] disabled:bg-gray-300 disabled:opacity-100"
                  disabled={loading}
                >
                  {loading ? <ButtonLoading /> : step === 1 ? "Next" : "Finish"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
