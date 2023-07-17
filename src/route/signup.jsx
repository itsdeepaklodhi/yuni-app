import { useEffect } from "react";
import { useState } from "react";
import { Outlet, useOutlet, useOutletContext } from "react-router-dom";
import { SessionContext } from "../App";

export default function Signup() {
  
  const { setNavComp } = useOutletContext();

  useEffect(() => setNavComp("register"), []);

  const email = {endpoint: "https://api.yunistore.in/auth/signup/verify-email/email",
       to:"/signup/enter-otp"
};
const otp = {endpoint: "https://api.yunistore.in/auth/signup/verify-email/otp",
to: "/signup/user-details"     }               



return <Outlet context={{email, otp}} />
}
