import { useEffect, useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { LocationContext } from "../App";
import Categories from "../component/categories";
import ProductGrid, { Placeholder } from "../component/productgrid";
import intro from "../images/intro-bg.jpg";

export default function Home() {
  // console.log("in home");
  const { location } = useContext(LocationContext);

  const [error, setError] = useState(undefined);
  const [data, setData] = useState(undefined);

  if (error) {
    throw error;
  }

  useEffect(() => {
    if (location) {
      const formData = new FormData();
      formData.append("size", 20);
      formData.append("page", 0);
      // formData.append("ltd", 24.5701017);
      formData.append("ltd", location.latitude);
      // formData.append("lng", 77.733788);
      formData.append("lng", location.longitude);

      fetch(`https://api.yunistore.in/public/products/new`, {
        method: "post",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw res;

          return res.json();
        })
        .then((data) => setData(data))
        .catch((err) => setError(err));
    }
  }, [location]);

  return (
    <>
      <section
        className="bg-primary shadow home-banner"
        style={{
          backgroundImage: `url(${intro})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div
          className="container align-items-center justify-content-center d-flex"
          style={{ minHeight: "520px" }}
        >
          <article className="text-center">
            <h1 className="display-4 text-white">
              Find great products <br />
              around you
            </h1>
            <p className="lead text-white">make your shopping more easier.</p>
            {/* <a href="#" className="btn btn-warning py-1">
              Continue
            </a> */}
          </article>
        </div>
      </section>
      <Categories />

      <section className="padding-y">
        <div className="container">
          <header className="section-heading">
            <h2 className="section-title">New products</h2>
          </header>
          {data ? (
            <ProductGrid products={data.content} />
          ) : (
            <Placeholder length="12" />
          )}
        </div>
      </section>
    </>
  );
}
