import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FaList, FaUser } from "react-icons/fa6";

function Positions() {
  const [positions, setPositions] = useState<"user" | "all">("user");
  return (
    <div className="mt-12 mb-4">
      <h1 className="text-2xl font-karla-bold text-primary">
        Liquidity Positions
      </h1>
      <p className="text-gray-500 text-sm font-karla">
        Explore all your liquidity positions accessible via ICPSwap
      </p>
      <div className="flex items-center justify-start gap-4 mt-4">
        <div
          className={cn(
            "flex mx-2 items-center justify-between gap-1 cursor-pointer",
            positions === "user" ? "border-b-2 border-primary" : ""
          )}
          onClick={() => setPositions("user")}
        >
          <FaUser
            className={cn(
              "w-4 h-4",
              positions === "user" ? "text-primary" : "text-gray-500"
            )}
          />
          <h1
            className={cn(
              "text-gray-500 text-lg font-karla",
              positions === "user" ? "text-primary" : ""
            )}
          >
            My Positions
          </h1>
        </div>
        <div
          className={cn(
            "flex mx-2 items-center justify-between gap-1 cursor-pointer",
            positions === "all" ? "border-b-2 border-primary" : ""
          )}
          onClick={() => setPositions("all")}
        >
          <FaList
            className={cn(
              "w-4 h-4",
              positions === "all" ? "text-primary" : "text-gray-500"
            )}
          />
          <h1
            className={cn(
              "text-gray-500 text-lg font-karla",
              positions === "all" ? "text-primary" : ""
            )}
          >
            All pools
          </h1>
        </div>
      </div>
      {positions === "user" ? (
        <div className="flex flex-col gap-4 mt-4 w-full">
          <div className="flex items-center justify-center">
            <h1 className="text-gray-500 text-center text-sm font-karla my-4">
              You have no open positions
            </h1>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Positions;
