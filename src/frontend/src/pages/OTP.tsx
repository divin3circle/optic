import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Lottie from "lottie-react";
import animation from "../../assets/lottie/messaging.json";
import { motion } from "framer-motion";
import logo from "../../assets/images/icon.png";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Invalid OTP. Please try again.",
  }),
});

function OTP() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-full md:w-[60%] flex flex-col-reverse md:flex-row gap-2 bg-background p-1.5 rounded-xl">
        <div className="w-full md:w-1/2">
          <Lottie animationData={animation} loop={true} />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 p-4"
          >
            <a href="/">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, y: 100 }}
                className="flex items-center justify-center gap-1 p-2 rounded-3xl  cursor-pointer"
              >
                <img src={logo} alt="logo" className="w-6 h-6" />
                <h1 className="text-lg font-karla-bold text-primary">Optic</h1>
              </motion.div>
            </a>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-center justify-center">
                  <FormLabel className="text-primary">Enter OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="text-primary">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="text-primary">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className=" h-12 text-white rounded-full bg-[#e8492a] hover:bg-[#e8492a]/80 mt-4 w-full"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default OTP;
