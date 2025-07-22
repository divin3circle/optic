import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaX } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoIcon, XIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DASHBOARD_TOKENS } from "../../../../types/tokens";
import { useState } from "react";
import { backend } from "../../../../utils";
import { LoadingSmall } from "@/components/ui/Loading";
import useUser from "../../../../store/user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  profileImage: z.url().min(2, {
    message: "Profile image must be at least 2 characters.",
  }),
  investmentCycle: z.string().min(2, {
    message: "Investment cycle must be at least 2 characters.",
  }),
  maxContribution: z.string().min(1, {
    message: "Max contribution must be at least 1.",
  }),
  treasuryToken: z.string().min(2, {
    message: "Treasury token must be at least 2 characters.",
  }),
});

function CreateGroupModal({
  setIsCreateRoomModalOpen,
}: {
  setIsCreateRoomModalOpen: (isOpen: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      profileImage: "",
      investmentCycle: "",
      maxContribution: "1",
      treasuryToken: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!form.formState.isValid) {
      toast.error("Please fill in all fields");
      return;
    }
    console.log(values);
    if (!user) {
      toast.error("Please login to create a group");
      setIsCreateRoomModalOpen(false);
      return;
    }
    try {
      setIsLoading(true);
      const groupCreated = {
        name: values.name,
        description: values.description,
        profileImage: values.profileImage,
        contributionCycle: "weekly",
        investmentCycle: values.investmentCycle,
        maxContribution: values.maxContribution,
        treasuryToken: values.treasuryToken,
        created_by: user.id,
      };
      console.log(groupCreated);
      const isCreated = await backend.create_group_chat(
        groupCreated.name,
        groupCreated.treasuryToken,
        groupCreated.contributionCycle,
        groupCreated.investmentCycle,
        groupCreated.profileImage,
        groupCreated.description,
        Number(groupCreated.maxContribution),
        groupCreated.created_by
      );
      if (isCreated) {
        toast.success("Group created successfully");
        // invalidate the groups query
        queryClient.invalidateQueries({ queryKey: ["groupChatRooms"] });
        setIsCreateRoomModalOpen(false);
      } else {
        toast.error("Failed to create group");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/70 md:bg-black/80 z-50"
      >
        <div className="bg-[#faf6f9] border border-gray-200 rounded-3xl p-4 w-full max-w-md mx-1 mb-2">
          <div className="flex items-center justify-between">
            <h1 className="text-primary font-karla text-lg font-bold">
              Create Group
            </h1>
            <FaX
              className="text-sm cursor-pointer text-gray-500"
              onClick={() => setIsCreateRoomModalOpen(false)}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="mt-4">
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
                            className="h-10 rounded-3xl text-primary"
                            placeholder="https://example.com/image.png"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-karla-semi-bold text-primary">
                      Group Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Group Name"
                        {...field}
                        className="rounded-3xl h-10 text-primary font-karla"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-karla-semi-bold text-primary">
                      Group Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of your group"
                        {...field}
                        className="rounded-3xl text-primary font-karla resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="treasuryToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-karla-semi-bold text-primary">
                        Treasury Token
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 rounded-2xl text-primary w-full">
                              <SelectValue placeholder="Select a token" />
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Treasury Token</SelectLabel>
                                  {DASHBOARD_TOKENS?.map((token, index) => (
                                    <SelectItem
                                      key={index}
                                      value={token.symbol}
                                      className="flex items-center gap-2"
                                    >
                                      <img
                                        src={token.icon}
                                        alt={token.name}
                                        className="w-6 h-6 rounded-full"
                                      />
                                      {token.symbol}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </SelectTrigger>
                          </FormControl>
                          <FormDescription className="text-xs font-karla text-gray-500 flex items-center gap-2">
                            <InfoIcon className="w-4 h-4 text-gray-500" />
                            This is the token that will be used to fund the
                            group.
                          </FormDescription>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="investmentCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-karla-semi-bold text-primary">
                        Investment Cycle
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 rounded-2xl text-primary w-full">
                              <SelectValue placeholder="Select a cycle" />
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Investment Cycle</SelectLabel>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">
                                    Monthly
                                  </SelectItem>
                                  <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </SelectTrigger>
                          </FormControl>
                          <FormDescription className="text-xs font-karla text-gray-500 flex items-center gap-2">
                            <InfoIcon className="w-4 h-4 text-gray-500" />
                            Indicates the frequency of when the earnings are
                            withdrawn and distributed to the group members.
                          </FormDescription>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-karla-semi-bold text-primary mt-4">
                        Max Contribution
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Max contribution in ${form.watch(
                            "treasuryToken"
                          )} per cycle`}
                          {...field}
                          className="rounded-3xl h-10 text-primary font-karla"
                        />
                      </FormControl>
                      <FormDescription className="text-xs font-karla text-gray-500 flex items-center gap-2">
                        <InfoIcon className="w-4 h-4 text-gray-500" />
                        This is the maximum amount of{" "}
                        {form.watch("treasuryToken")} that can be contributed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-3xl h-10 bg-[#e8492a] text-white font-karla-semi-bold"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? <LoadingSmall /> : "Create Group"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateGroupModal;
