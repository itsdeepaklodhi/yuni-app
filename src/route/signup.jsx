import { useEffect } from "react";
import { useState } from "react";
import { Outlet, useOutlet, useOutletContext } from "react-router-dom";
import { SessionContext } from "../App";

export default function Signup() {
  const [token, setT] = useState(sessionStorage.getItem("sessionToken"));
  const { setNavComp } = useOutletContext();

  useEffect(() => setNavComp("register"), []);

  const setToken = (t) => {
    sessionStorage.setItem("sessionToken", t);
    setT(t);
  };

  return (
    <SessionContext.Provider value={{ token, setToken }}>
      <Outlet />
    </SessionContext.Provider>
  );
}
