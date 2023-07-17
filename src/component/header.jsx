
import yunistore from "../images/yunistore-1.png";
import { Form, Link, useSearchParams } from "react-router-dom";


export default function Header() {
  const [searchParams] = useSearchParams();

  const distance = searchParams.get("distance") || 10;

  return (
    <header className="header-main bg-white border-bottom">
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-lg-2 col-sm-4 col-4">
            <Link to={"/"} className="navbar-brand">
              <img
                src={yunistore}
                alt="yunistore logo"
                height="40px"
                width="120px"
              />
            </Link>
          </div>
          <div className="order-lg-last col-lg-5 col-sm-8 col-8">
            <div className="float-end">
              <Link to="/" className="btn btn-light me-1 py-1">
                <i className="bi bi-house-door"></i>
                <span className="ms-1 d-none  d-md-inline-block">Home</span>
              </Link>
              <Link to="/profile/store" className="btn btn-light me-1 py-1">
                <i className="bi bi-shop-window"></i>
                <span className="ms-1 d-none d-md-inline-block">Store</span>
              </Link>
              <Link to="/profile/main" className="btn btn-light me-1 py-1">
                <i className="bi bi-person-circle"></i>
                <span className="ms-1  d-md-inline-block">Profile </span>
              </Link>
            </div>
          </div>
          <div className="col-lg-5 col-md-12 col-12">
            <Form action="/search" className="" method="get">
              <div className="input-group">
                <input
                  required
                  type="search"
                  name="query"
                  className="form-control"
                  style={{ width: "55%" }}
                  placeholder="Search"
                />
                <select className="form-select" name="type">
                  <option value="product">Product</option>
                  <option value="store">Store</option>
                </select>
                <input type="number" className="d-none" readOnly name="distance" value={distance} />
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search" style={{ fontSize: "17px" }}></i>
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </header>
  );
}
