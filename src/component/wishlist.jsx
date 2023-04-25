import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { JwtContext } from "../App";
import ProductGrid from "./productgrid";

export default function WishList() {
  const { setNavComp } = useOutletContext();
  const { jwt } = useContext(JwtContext);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  if (error) throw error;

  useEffect(() => {
    setNavComp("wishlist");
    getProducts();
  }, []);

  const getProducts = () => {
    if (!jwt) return;

    fetch(`https://api.yunistore.in/user/wishlist`, {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((products) => setProducts(products))
      .catch((err) => setError(err));
  };

  if (!products)
    return (
      <>
        <div
          class="d-flex justify-content-center align-items-center "
          style={{ height: "40vh" }}
        >
          <div class="spinner-border " role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );

  if (!products.length)
    return (
      <div
        className="d-flex align-items-center flex-column justify-content-center"
        style={{ height: "40vh" }}
      >
        <h3 className="">Sorry, Empty Wishlist!</h3>
      </div>
    );

  return (
    <div className="container py-3">
      <ProductGrid products={products} />
    </div>
  );
}
