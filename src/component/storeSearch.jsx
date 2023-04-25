import { useEffect, useState, useContext } from "react";
import { LocationContext } from "../App.js";
import { useNavigate } from "react-router-dom";
import Pagination from "./pagination.jsx";
import StoreList, { Placeholder } from "./storeList.jsx";
import { NoResult } from "../route/search.jsx";
export default function StoreSearch(props) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const { location } = useContext(LocationContext);
  if (error) throw error;

  const requestData = () => {
    if (!props.location) return;
    setLoading(true);
    const pageSize = 20;
    const formData = new FormData();
    formData.append("query", props.query);
    formData.append("size", pageSize);
    formData.append("page", props.page - 1);
    // formData.append("ltd", 24.5701017);
    formData.append("ltd", location.latitude);
    // formData.append("lng", 77.733788);
    formData.append("lng", location.longitude);

    fetch(`https://api.yunistore.in/public/stores/search`, {
      method: "post",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    requestData();
  }, [props.page, props.query, location]);

  if (loading) {
    return (
      <>
        <header className="bg-primary mb-4 py-3 text-white">
          <div className="container d-flex align-items-center justify-content-between">
            <strong className="d-block py-2">Searching...</strong>
          </div>
        </header>
        <div className="container pb-3">
          <Placeholder />
        </div>
      </>
    );
  }

  return (
    <>
      <header className="bg-primary mb-4 py-1 text-white">
        <div className="container d-flex align-items-center justify-content-between">
          <strong className="d-block py-2">
            {data.totalElements}
            {data.totalElements > 1 ? " Store's Found" : " Store Found"}
          </strong>
        </div>
      </header>

      {data.content.length ? (
        <>
          <div className="container">
            <StoreList stores={data.content} />
          </div>
          <Pagination
            currentPage={props.page}
            changeCurrentPage={props.changePage}
            totalPages={data.totalPages}
          />
        </>
      ) : (
        <NoResult />
      )}
    </>
  );
}
