import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationContext } from "../App";
import ProductSearch from "../component/productSearch";
import StoreSearch from "../component/storeSearch";

export default function Search() {
  const [searchParams] = useSearchParams();
  const { location } = useContext(LocationContext);
  const navigate = useNavigate();

  const type = searchParams.get("type");
  const query = searchParams.get("query");
  const page = searchParams.get("page") || 1;

  // console.log(query);

  const changePage = (pageNo) => {
    navigate(`/search?query=${query}&type=${type}&page=${pageNo}`);
  };

  return (
    <section>
      {type === "product" ? (
        <ProductSearch {...{ query, page, changePage, location }} />
      ) : (
        <StoreSearch {...{ query, page, changePage, location }} />
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
      <h2 className="">Sorry, no results found!</h2>
      <p className="fw-lighter fs-5 text-center">
        Please check the spelling or try searching for something else
      </p>
    </div>
  );
}
