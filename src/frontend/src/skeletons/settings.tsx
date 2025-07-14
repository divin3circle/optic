import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function SettingsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen w-full"
    >
      <div className="flex flex-col gap-4 w-full px-4">
        <Skeleton className="h-32 rounded-3xl bg-gray-200 w-full" />
        <Skeleton className="h-6 rounded-full bg-gray-200 w-3/4 md:w-1/4 mt-4" />
        <div className="flex items-center justify-center flex-col w-full">
          <Skeleton className="h-4 rounded-full bg-gray-200 w-3/4 md:w-1/4 mt-4" />
        </div>{" "}
      </div>
    </motion.div>
  );
}
