import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import yunistore from "./images/yunistore-1.png";

export default function Layout2() {
  const [navComp, setNavComp] = useState(undefined);

  return (
    <>
      <header className="section-header border-bottom bg-white">
        <section className="header-main">
          <div className="container">
            <div className="row gy-3 align-items-center">
              <div className="col-4">
                <Link to="/" className="brand-wrap">
                  <img className="logo" height="40" src={yunistore} />
                </Link>
              </div>
              <div className="col-8">
                <div className="float-end">
                  <Link
                    to="/signin"
                    className={
                      navComp === "signin"
                        ? "btn btn-primary me-1"
                        : "btn btn-outline-primary me-1"
                    }
                  >
                    Sign in
                  </Link>
                  <Link
                    to="signup/enter-email"
                    className={
                      navComp === "register"
                        ? "btn btn-primary"
                        : "btn btn-outline-primary"
                    }
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>
      <Outlet context={{ setNavComp }} />
      <footer className="section-footer border-top padding-y bg-white  w-100">
        <div className="container">
          <p className="float-md-end">© Copyright 2022 All rights reserved</p>
          <p>
            <a href="#" className="link-primary">
              Terms and conditions
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
