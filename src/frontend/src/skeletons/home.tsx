import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function HomeSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen w-full"
    >
      <div className="flex flex-col gap-4 w-full px-4">
        <Skeleton className=" h-32 rounded-3xl bg-gray-200 w-full" />
        <Skeleton className="h-6 rounded-full bg-gray-200 w-3/4 md:w-1/4 mt-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-44 rounded-3xl bg-gray-200 w-full"
            />
          ))}
        </div>
        <Skeleton className="h-6 rounded-full bg-gray-200 w-3/4 md:w-1/4" />
        <div className="flex flex-col items-center md:flex-row md:justify-between gap-4 ">
          <Skeleton className="h-96 rounded-3xl bg-gray-200 w-full" />
          <Skeleton className="h-96 rounded-3xl bg-gray-200 w-full" />
        </div>
        <Skeleton className="h-6 rounded-full bg-gray-200 w-3/4 md:w-1/4 mt-4" />
        <Skeleton className="h-44 rounded-3xl bg-gray-200 w-full" />
      </div>
    </motion.div>
  );
}
