import { Outlet } from "react-router-dom";
import Header from "./component/header";
import Footer from "./component/footer";
import LocationError from "./component/locationerror";
import AskLocation from "./component/asklocation";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { LocationContext } from "./App";
import ErrorBoundary from "./errorBoundry";

export default function Layout1() {
  const [pageState, setPageState] = useState("default");
  const { location, setLocation } = useContext(LocationContext);

  const getLocation = () => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setPageState("default");
      },
      () => setPageState("denied")
    );
  };

  useEffect(() => {
    if (pageState === "prompt") return;

    if (location === null) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        const permission = result.state;
        if (permission === "granted") {
          getLocation();
          return;
        }
        setPageState(permission);
      });
    }
  });

  return (
    <>
      <Header />
      <div>

      {pageState === "denied" ? <LocationError /> : null}
      {pageState === "prompt" ? (
        <AskLocation getLocation={getLocation} />
        ) : null}

      <Outlet />
        </div>
      <Footer />
    </>
  );
}
