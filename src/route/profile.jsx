
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { JwtContext, ToastContext } from "../App";

export default function Profile() {
  // console.log("in profile");

  const navigate = useNavigate();
  const { jwt, setJwt } = useContext(JwtContext);
  const [navComp, setNavComp] = useState("");
  const { notify } = useContext(ToastContext);

  useEffect(() => {
    if (!jwt) navigate("/signin", {replace: true});
  });

  const arr = ["main", "wishlist", "store"];

  return (
    <>
      <section className="bg-primary py-3">
        <div className="container">
          <ol className="breadcrumb ondark mb-0">
            <li className="breadcrumb-item">
              <span>Home</span>
            </li>
            <li className="breadcrumb-item">
              <span>Profile</span>
            </li>
            <li
              className="breadcrumb-item text-capitalize active"
              aria-current="page"
            >
              {navComp}
            </li>
          </ol>
        </div>
      </section>
      <section className="py-lg-4 py-2 bg-light" style={{ minHeight: "80vh" }}>
        <div className="container">
          <div className="row">
            <aside className="pb-0 col-lg-2">
              {/*<!--  COMPONENT MENU LIST  -->*/}
              <nav className="nav flex-lg-column nav-pills mb-2">
                {arr.map((item) => (
                  <Link
                    to={`/profile/${item}`}
                    className={
                      item === navComp
                        ? "nav-link text-capitalize active"
                        : "nav-link text-capitalize"
                    }
                    key={item}
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  to="/"
                  onClick={() => {
                    setJwt("");
                    notify("You Are Logged Out");
                  }}
                  className="nav-link"
                  key="logout"
                >
                  Logout
                </Link>
              </nav>
              {/*<!--   COMPONENT MENU LIST END .//   -->*/}
            </aside>
            <main className="col-lg-10 bg-white p-0">
              <Outlet context={{ setNavComp }} />
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
