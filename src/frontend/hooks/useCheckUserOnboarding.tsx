import { useEffect, useState } from "react";
import { backend } from "../utils/index.js";
import { useAuth } from "@nfid/identitykit/react";
import { useNavigate } from "react-router-dom";

export const useCheckUserOnboarding = () => {
  const { user } = useAuth();
  const [checkingUser, setCheckingUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        setCheckingUser(true);
        const u = await backend.get_user(user.principal);
        if (u.length === 0) {
          console.log("user not found, starting onboarding");
        } else {
          console.log("user found, redirecting to otp");
          navigate("/otp");
        }
        setCheckingUser(false);
      }
    };
    checkUser();
  }, []);

  return { checkingUser };
};
