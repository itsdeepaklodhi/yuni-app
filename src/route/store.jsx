import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import storedp from "../images/storedp.jpg";
import ProductGrid, { Placeholder } from "../component/productgrid";
import InfiniteScroll from "react-infinite-scroller";
import tt from "@tomtom-international/web-sdk-maps";
import { ttKey } from "../config";

export default function Store() {
  const [store, setStore] = useState(undefined);
  const mapContainer = useRef(null);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.yunistore.in/public/stores/${id}`)
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((data) => setStore(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!store) return;
    const storeLocation = [store.lng, store.ltd];
    // const current = [77.733788, 24.5701017];
    var map = tt.map({
      key: ttKey,
      container: mapContainer.current,
      center: storeLocation,
      zoom: 13,
      dragPan: true,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());

    let popup = new tt.Popup().setHTML(`<h6>${store.name}</h6>`).setOffset(30);
    new tt.Marker().setLngLat(storeLocation).setPopup(popup).addTo(map);
    // .togglePopup();
  }, [store]);

  const getProducts = async () => {
    return fetch(
      `https://api.yunistore.in/public/stores/${id}/products?page=${page}`
    )
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        setPage(page + 1);
        let arr = [...products, ...data.content];
        setProducts([...arr]);
        setHasMore(!data.last);
        // console.log(data.last);
        // console.log(page);
        return arr;
      })
      .catch((err) => setError(err));
  };

  if (loading)
    return (
      <>
        <div
          className="d-flex justify-content-center align-items-center "
          style={{ height: "90vh" }}
        >
          <div className="spinner-border " role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );

  return (
    <section className="py-3">
      {/******  ******************* HEADER OF STORE *******************************/}
      <div className="mb-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 ">
              <div className="row">
                <aside className="col-5 store bg-light">
                  <div className="img-wrap">
                    <img src={store.imageUrl || storedp} alt="store" />
                  </div>
                </aside>
                <div className="col-7">
                  <div className="p-1 pt-2">
                    <h4>{store.name}</h4>
                    <p>{store.category}</p>

                    <a href={`tel:${store.contact}`}>{store.contact}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-3 d-md-none"></div>
            <div
              className="col-md-6 col-lg-6 p-0"
              ref={mapContainer}
              style={{ height: "170px" }}
            ></div>
          </div>
        </div>
      </div>
      {/****************************END OF HEADER  *******************************/}
      <div className="bg-light mb-4 py-2 ">
        <div className="container d-flex align-items-center justify-content-between">
        
        <h5 className="d-block py-2 m-0">Products </h5>
        </div>
      </div>
      {/**************************END OF NAV *****************************/}

      <InfiniteScroll
        pageStart={0}
        loadMore={getProducts}
        hasMore={hasMore}
        threshold="300"
        loader={<Placeholder length="4" />}
      >
        <div className="container">
          <ProductGrid products={products} />
        </div>
      </InfiniteScroll>
    </section>
  );
}
