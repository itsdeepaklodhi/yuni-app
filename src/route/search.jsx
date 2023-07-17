import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DistanceContext, LocationContext } from "../App";
import ProductSearch from "../component/productSearch";
import StoreSearch from "../component/storeSearch";
import { useEffect } from "react";


export default function Search() {
  const [searchParams] = useSearchParams();
  const { location } = useContext(LocationContext);
  
  const navigate = useNavigate();

  const type = searchParams.get("type");
  const query = searchParams.get("query");
  const page = searchParams.get("page") || 1;
  const distance = searchParams.get("distance") || 10;

  // console.log(query);

  const changePage = (pageNo) => {
    navigate(`/search?query=${query}&type=${type}&distance=${distance}&page=${pageNo}`);
  };

  const changeDistance = (newDistance) => {
    navigate(`/search?query=${query}&type=${type}&distance=${newDistance}`)
  }

  return (
    <section>
      {type === "product" ? (
        <ProductSearch {...{ query, page, distance, changePage, location, changeDistance }} />
      ) : (
        <StoreSearch {...{ query, page, distance, changePage, location, changeDistance }} />
      )}
    </section>
  );
}

export function NoResult() {
  return (
    <div
      className="container d-flex align-items-center flex-column justify-content-center"
      style={{ height: "60vh" }}
    >
      <h3 className="">Sorry, no results found!</h3>
      <p className="fw-lighter fs-6 text-center">
        Please check the spelling or try searching for something else
      </p>
    </div>
  );
}
