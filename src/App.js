import { Outlet, ScrollRestoration } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import ToastAlert from "./component/toastAlert";
import { Toast } from "bootstrap";

export const LocationContext = createContext(null);
export const JwtContext = createContext(null);
export const SessionContext = createContext(null);
export const ToastContext = createContext(null);

export default function App() {
  const [location, setL] = useState(
    JSON.parse(sessionStorage.getItem("location"))
  );
  const [jwt, setJ] = useState(sessionStorage.getItem("jwt"));
  const [toast, setToast] = useState(undefined);

  const setLocation = (latLng) => {
    console.log(latLng);
    sessionStorage.setItem("location", JSON.stringify(latLng));
    setL(latLng);
  };

  const setJwt = (jwt) => {
    sessionStorage.setItem("jwt", jwt);
    setJ(jwt);
  };

  const notify = (msg) => {
    setToast({ ...toast, msg });
    toast.instance.show();
    console.log(toast);
  };

  useEffect(() => {
    if (toast) return;
    setToast({
      msg: "",
      instance: new Toast(document.getElementById("toast")),
    });
  });

  return (
    <div id="appdiv">
      <LocationContext.Provider value={{ location, setLocation }}>
        <JwtContext.Provider value={{ jwt, setJwt }}>
          <ToastContext.Provider value={{ notify }}>
            <Outlet />
            <ScrollRestoration />
            <ToastAlert msg={toast && toast.msg} />
          </ToastContext.Provider>
        </JwtContext.Provider>
      </LocationContext.Provider>
    </div>
  );
}
