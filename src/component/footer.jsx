import yunistore from "../images/yunistore-1.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="section-footer bg-primary footer-dark shadow footer mt-auto ">
      <div className="container">
        <section className="footer-main padding-y">
          <div className="row">
            <aside className="col-lg-6">
              <article className="me-lg-4 mb-4">
                <img src={yunistore} className="logo-footer" />
                <p className="mt-3">
                  Tired of wandering around stores in search of product that you
                  need? maybe yunistore can get you there.
                </p>
                <nav>
                  <a
                    className="btn btn-icon btn-light me-1"
                    title="Facebook"
                    
                    href="#"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    className="btn btn-icon btn-light me-1"
                    title="Instagram"
                  
                    href="#"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    className="btn btn-icon btn-light me-1"
                    title="Youtube"
                    
                    href="#"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                  <a
                    className="btn btn-icon btn-light me-1"
                    title="Twitter"
                  
                    href="#"
                  >
                    <i className="bi bi-twitter"></i>
                  </a>
                </nav>
              </article>
            </aside>
            <aside className="col-4 col-sm-4 col-lg-2">
              <h6 className="title">About</h6>
              <ul className="list-menu mb-4">
                <li>
                  <a href="#">About us</a>
                </li>
                <li>
                  <a href="#">Documents</a>
                </li>
                <li>
                  <a href="#">Terms and Policy</a>
                </li>
                
              </ul>
            </aside>
            <aside className="col-4 col-sm-4 col-lg-2">
              <h6 className="title">Services</h6>
              <ul className="list-menu mb-4">
                <li>
                  <a href="#">Help center</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
                <li>
                  <a href="#">Contact us</a>
                </li>
               
              </ul>
            </aside>
            <aside className="col-4 col-sm-4 col-lg-2">
              <h6 className="title">For users</h6>
              <ul className="list-menu mb-4">
                <li>
                  <Link to="/signin"> User Login </Link>
                </li>
                <li>
                  <Link to="/signup/enter-email"> User register </Link>
                </li>
                <li>
                  <Link to="/profile/main"> Account Setting </Link>
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="footer-bottom d-flex justify-content-lg-between border-top">
          <p className="mb-0">© 2022 Yunistore. All rights reserved.</p>
        </section>
      </div>
    </footer>
  );
}
