import { useEffect, useState } from "react";
import { backend } from "../utils/index.js";
import { useAuth } from "@nfid/identitykit/react";
import { User } from "../types/user.js";
import useUserStore from "../store/user.js";
import { useQuery } from "@tanstack/react-query";
import { Principal } from "@dfinity/principal";

export const useUser = () => {
  const { user } = useAuth();
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setLoading(true);
        const u = await backend.get_user(user.principal);
        setUser?.(u[0] as User);
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  return { loading };
};

export function useGetUser(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => backend.get_user(Principal.fromText(id)),
  });
  return { data, isLoading };
}
