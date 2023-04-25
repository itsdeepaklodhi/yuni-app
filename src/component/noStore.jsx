import { useEffect } from "react";
import { Link, useOutlet, useOutletContext } from "react-router-dom";

export default function NoStore() {
  const { setNavComp } = useOutletContext();

  useEffect(() => setNavComp("store"), []);

  return (
    <div
      className="d-flex align-items-center flex-column justify-content-center"
      style={{ height: "50vh" }}
    >
      <h4 className="">You don't have any store!</h4>
      <Link to="/add-store" className="btn btn-primary">
        Add Store
      </Link>
    </div>
  );
}
